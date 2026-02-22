import { addHeadOfficerToThanaService, addThanaService, getAllThanasService, getThanasByDistrictService, signinThanaService, getThanaByIdService, updateThanaService, deleteThanaService } from "../services/thanaService.js"; 
import { generateJwtToken } from "../utils/jwtToken.js";

export const addThanaContoller = async (req, res) => {
    try {
        const thanaData = req.body;
        const admin_id = req.id;
        const newThana = await addThanaService(thanaData, admin_id);

        if(!newThana) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add new thana'
            });
        }

        return res.status(201).json({
            success: true,
            data: newThana
        });
    } catch (error) {
        console.log('Error adding thana at addThanaContoller:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signinThanaController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const registeredThana = await signinThanaService(email, password);

        if(!registeredThana) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateJwtToken(registeredThana.thana_id);

        return res.status(200).cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 86400 * 1000}).json({
            success: true,
            message: 'Thana signed in successfully',
            data: {
                user: registeredThana,
                token: token
            }
        })
    } catch (error) {
        console.log('Error signing in thana at signinThanaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signoutThanaController = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {httpOnly: true, sameSite: "strict", maxAge: 0}).json({
            success: true,
            message: 'Thana signed out successfully'
        });
    } catch (error) {
        console.log('Error signing out thana at signoutThanaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const addHeadOfficerToThanaController = async (req, res) => {
    try {
        const { head_officer_id } = req.body;

        const thana_id = req.id;

        if(!thana_id || !head_officer_id) {
            return res.status(400).json({
                success: false,
                message: 'Thana ID and Head Officer ID are required'
            });
        }

        const updatedThana = await addHeadOfficerToThanaService(thana_id, head_officer_id);

        if(!updatedThana) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add head officer to thana'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedThana
        });
    } catch (error) {
        console.log('Error adding head officer to thana at addHeadOfficerToThanaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getThanasByDistrictController = async (req, res) => {
    try {
        console.log('Received request to get thanas by district with params:', req.params);
        const { district } = req.params;

        if(!district) {
            return res.status(400).json({
                success: false,
                message: 'District is required'
            });
        }

        const thanas = await getThanasByDistrictService(district);

        if(!thanas || thanas.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No thanas found for the specified district'
            });
        }

        return res.status(200).json({
            success: true,
            data: thanas
        });
    } catch (error) {
        console.log('Error fetching thanas by district at getThanasByDistrictController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// by Rayyan 2.0

export const getAllThanasController = async (req, res) => {
    try {
        const thanas = await getAllThanasService();

        if (!thanas || thanas.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No thanas found'
            });
        }

        return res.status(200).json({
            success: true,
            data: thanas
        });
    } catch (error) {
        console.log('Error fetching all thanas at getAllThanasController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getThanaByIdController = async (req, res) => {
    try {
        const { thanaId } = req.params;

        if (!thanaId) {
            return res.status(400).json({
                success: false,
                message: 'Thana ID is required'
            });
        }

        const thana = await getThanaByIdService(thanaId);

        if (!thana) {
            return res.status(404).json({
                success: false,
                message: 'Thana not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: thana
        });
    } catch (error) {
        console.log('Error fetching thana by ID at getThanaByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateThanaController = async (req, res) => {
    try {
        const { thanaId } = req.params;
        const data = req.body;

        if (!thanaId) {
            return res.status(400).json({
                success: false,
                message: 'Thana ID is required'
            });
        }

        const updatedThana = await updateThanaService(thanaId, data);

        if (!updatedThana) {
            return res.status(404).json({
                success: false,
                message: 'Thana not found or update failed'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedThana
        });
    } catch (error) {
        console.log('Error updating thana at updateThanaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteThanaController = async (req, res) => {
    try {
        const { thanaId } = req.params;

        if (!thanaId) {
            return res.status(400).json({
                success: false,
                message: 'Thana ID is required'
            });
        }

        const deletedThana = await deleteThanaService(thanaId);

        if (!deletedThana) {
            return res.status(404).json({
                success: false,
                message: 'Thana not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedThana
        });
    } catch (error) {
        console.log('Error deleting thana at deleteThanaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}