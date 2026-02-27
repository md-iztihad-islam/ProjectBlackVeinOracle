import { addJailService, getAllJailsService, getJailByDistrictService, getJailByIdService, getJailByNameService, getJailByZoneService, signinJailService, updateJailService, deleteJailService } from "../services/jailService.js";
import { generateJwtToken } from "../utils/jwtToken.js";

export const addJailController = async (req, res) => {
    try {
        const jailData = req.body;
        const newJail = await addJailService(jailData);

        if(!newJail) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add new jail'
            });
        }

        return res.status(201).json({
            success: true,
            data: newJail
        });
    } catch (error) {
        console.log('Error adding jail at addJailController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signinJailController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const registeredJail = await signinJailService(req.body);

        if(!registeredJail) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateJwtToken(registeredJail.jail_id);

        return res.status(200).cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 86400 * 1000}).json({
            success: true,
            message: 'Jail signed in successfully',
            data: {
                user: registeredJail,
                token: token
            }
        });
    } catch (error) {
        console.log('Error signing in jail at signinJailController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signoutJailController = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {httpOnly: true, sameSite: "strict", expires: new Date(0)}).json({
            success: true,
            message: 'Jail signed out successfully'
        });
    } catch (error) {
        console.log('Error signing out jail at signoutJailController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getAllJailsController = async (_, res) => {
    try {
        const jails = await getAllJailsService();

        if(!jails) {
            return res.status(404).json({
                success: false,
                message: 'No jails found'
            });
        }

        return res.status(200).json({
            success: true,
            data: jails
        });
    } catch (error) {
        console.log('Error fetching jails at getAllJailsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getJailByIdController = async (req, res) => {
    try {
        const { jailId } = req.params;
        const jail = await getJailByIdService(jailId);

        if(!jail) {
            return res.status(404).json({
                success: false,
                message: 'Jail not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: jail
        });
    } catch (error) {
        console.log('Error fetching jail by ID at getJailByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getJailByNameController = async (req, res) => {
    try {
        const { jailName } = req.params;
        console.log('Received jailName:', jailName); // Debug log to check the received jailName
        const jails = await getJailByNameService(jailName);

        if(!jails || jails.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No jails found with the given name'
            });
        }

        return res.status(200).json({
            success: true,
            data: jails
        });
    } catch (error) {
        console.log('Error fetching jail by name at getJailByNameController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getJailByZoneController = async (req, res) => {
    try {
        const { zone } = req.params;
        const jails = await getJailByZoneService(zone);

        if(!jails || jails.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No jails found in the given zone'
            });
        }

        return res.status(200).json({
            success: true,
            data: jails
        });
    } catch (error) {
        console.log('Error fetching jail by zone at getJailByZoneController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getJailByDistrictController = async (req, res) => {
    try {
        const { district } = req.params;
        const jails = await getJailByDistrictService(district);
        
        if(!jails || jails.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No jails found in the given district'
            });
        }

        return res.status(200).json({
            success: true,
            data: jails
        });
    } catch (error) {
        console.log('Error fetching jail by district at getJailByDistrictController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// by Rayyan 2.0
export const updateJailController = async (req, res) => {
    try {
        const { jailId } = req.params;
        const data = req.body;
        const updatedJail = await updateJailService(jailId, data);

        if (!updatedJail) {
            return res.status(404).json({
                success: false,
                message: 'Jail not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedJail
        });
    } catch (error) {
        console.log('Error updating jail at updateJailController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteJailController = async (req, res) => {
    try {
        const { jailId } = req.params;
        const deletedJail = await deleteJailService(jailId);

        if (!deletedJail) {
            return res.status(404).json({
                success: false,
                message: 'Jail not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Jail deleted successfully',
            data: deletedJail
        });
    } catch (error) {
        console.log('Error deleting jail at deleteJailController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}