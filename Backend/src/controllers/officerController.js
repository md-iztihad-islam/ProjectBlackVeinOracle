import { addOfficerService, getAllOfficersService, getOfficersByThanaIdService, signinOfficerService, getOfficersByRankService, updateOfficerService, deleteOfficerService, searchOfficersService, getOfficerByIdService, resetPasswordService, getOfficerAnalyticsService, getOfficerByNameService } from "../services/officerService.js"; 
import { generateJwtToken } from "../utils/jwtToken.js";

export const addOfficerController = async (req, res) => {
    try {
        const officerData = req.body;
        const requiredFields = [
            "badge_no",
            "full_name",
            "rank_code",
            "phone",
            "email",
            "password",
            "image_url",
            "nid_number",
            "father_name",
            "mother_name",
            "birth_date",
            "gender"
        ];

        for (const field of requiredFields) {
            if (!officerData?.[field] || String(officerData[field]).trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: `${field} is required`
                });
            }
        }

        // If requester is thana, force their own thana_id.
        // If requester is admin, allow explicit thana_id from payload.
        if (req.role === "thana") {
            officerData.thana_id = req.id;
        }

        if (!officerData.thana_id) {
            return res.status(400).json({
                success: false,
                message: "thana_id is required"
            });
        }

        const newOfficer = await addOfficerService(officerData);

        if(!newOfficer) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add new officer'
            });
        }

        return res.status(201).json({
            success: true,
            data: newOfficer
        });
    } catch (error) {
        console.log('Error adding officer at addOfficerController:', error);
        if (error.message === 'birth_date and gender are required') return res.status(400).json({ success: false, message: 'birth_date and gender are required' });
        if (error.message === 'Invalid birth_date') return res.status(400).json({ success: false, message: 'birth_date must be a valid past date' });
        if (error.message === 'Invalid gender') return res.status(400).json({ success: false, message: 'gender must be one of: male, female, other' });
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signinOfficerController = async (req, res) => {
    try {
        console.log('Signin Officer Request Body:', req.body);   
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const officer = await signinOfficerService(email, password);

        if(!officer) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateJwtToken(officer.officer_id);

        return res.status(200).cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 86400 * 1000}).json({
            success: true,
            message: 'Officer signed in successfully',
            data: {
                user: officer,
                token: token
            }
        })
    } catch (error) {
        console.log('Error signing in officer at signinOfficerController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signoutOfficerController = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {httpOnly: true, sameSite: "strict", maxAge: 0}).json({
            success: true,
            message: 'Officer signed out successfully'
        });
    } catch (error) {
        console.log('Error signing out officer at signoutOfficerController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getAllOfficersController = async (_, res) => {
    try {
        const officers = await getAllOfficersService();

        if(!officers) {
            return res.status(404).json({
                success: false,
                message: 'No officers found'
            });
        }

        return res.status(200).json({
            success: true,
            data: officers
        });
    } catch (error) {
        console.log('Error fetching all officers at getAllOfficersController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getOfficersByThanaIdController = async (req, res) => {
    try {
        const thana_id = req.params.thana_id; 
        const officers = await getOfficersByThanaIdService(thana_id);

        if(!officers) {
            return res.status(404).json({
                success: false,
                message: 'No officers found for the given thana ID'
            });
        }

        return res.status(200).json({
            success: true,
            data: officers
        });
    } catch (error) {
        console.log('Error fetching officers by thana ID at getOfficersByThanaIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// by Rayyan 2.0
export const getOfficersByRankController = async (req, res) => {
    try {
        const { rankId } = req.params;

        if (!rankId) {
            return res.status(400).json({
                success: false,
                message: 'Rank ID is required'
            });
        }

        const officers = await getOfficersByRankService(rankId);

        return res.status(200).json({
            success: true,
            data: officers
        });
    } catch (error) {
        console.log('Error fetching officers by rank at getOfficersByRankController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateOfficerController = async (req, res) => {
    try {
        const { officerId } = req.params;
        const data = req.body;

        if (!officerId) {
            return res.status(400).json({
                success: false,
                message: 'Officer ID is required'
            });
        }

        const updatedOfficer = await updateOfficerService(officerId, data);

        if (!updatedOfficer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found or update failed'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedOfficer
        });
    } catch (error) {
        console.log('Error updating officer at updateOfficerController:', error);
        if (error.message === 'Invalid birth_date') return res.status(400).json({ success: false, message: 'birth_date must be a valid past date' });
        if (error.message === 'Invalid gender') return res.status(400).json({ success: false, message: 'gender must be one of: male, female, other' });
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteOfficerController = async (req, res) => {
    try {
        const { officerId } = req.params;

        if (!officerId) {
            return res.status(400).json({
                success: false,
                message: 'Officer ID is required'
            });
        }

        const deletedOfficer = await deleteOfficerService(officerId);

        if (!deletedOfficer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedOfficer
        });
    } catch (error) {
        console.log('Error deleting officer at deleteOfficerController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const searchOfficersController = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const officers = await searchOfficersService(q);

        return res.status(200).json({
            success: true,
            data: officers
        });
    } catch (error) {
        console.log('Error searching officers at searchOfficersController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getOfficerByIdController = async (req, res) => {
    try {
        const { officerId } = req.params;
        if (!officerId) {
            return res.status(400).json({
                success: false,
                message: 'Officer ID is required'
            });
        }

        const officer = await getOfficerByIdService(officerId);

        if (!officer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: officer
        });
    } catch (error) {
        console.log('Error fetching officer by ID at getOfficerByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const resetPasswordController = async (req, res) => {
    try {
        const { officerId } = req.params;
        const { current_password, new_password } = req.body;

        console.log('Reset Password Request Body:', req.body);
        console.log('Authenticated Officer ID:', officerId);


        if (!new_password) {
            return res.status(400).json({
                success: false,
                message: 'New password is required'
            });
        }

        const updatedOfficer = await resetPasswordService(officerId, current_password, new_password);

        if (!updatedOfficer) {
            return res.status(404).json({
                success: false,
                message: 'Officer not found or password reset failed'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Password reset successful'
        });
    } catch (error) {
        console.log('Error resetting password at resetPasswordController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getOfficerAnalyticsController = async (req, res) => {
    try {
        const { thanaId, district, gender, rank } = req.query;

        console.log('Get Officer Analytics Query Params:', req.query);

        const data = await getOfficerAnalyticsService(thanaId, district, gender, rank);

        return res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        console.log('Error fetching officer analytics at getOfficerAnalyticsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}

export const getOfficerByNameController = async (req, res) => {
    try {
        const { name } = req.params;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Officer name is required'
            });
        }

        const officers = await getOfficerByNameService(name);

        if (!officers || officers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No officers found with the given name'
            });
        }

        return res.status(200).json({
            success: true,
            data: officers
        });
    } catch (error) {
        console.log('Error fetching officer by name at getOfficerByNameController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}