import { addOfficerService, getAllOfficersService, getOfficersByThanaIdService, signinOfficerService, getOfficersByRankService, updateOfficerService, deleteOfficerService, searchOfficersService, getOfficerByIdService } from "../services/officerService.js"; 
import { generateJwtToken } from "../utils/jwtToken.js";

export const addOfficerController = async (req, res) => {
    try {
        const officerData = req.body;
        const thana_id = req.id;
        officerData.thana_id = thana_id;
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