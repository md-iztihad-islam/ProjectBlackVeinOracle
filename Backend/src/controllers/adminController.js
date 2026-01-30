import { addAdminService, signinAdminService } from "../services/adminService.js";
import { generateJwtToken } from "../utils/jwtToken.js";

export const addAdminController = async (req, res) => {
    try {
        const adminData = req.body;
        const newAdmin = await addAdminService(adminData);

        if(!newAdmin) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add new admin'
            });
        }

        return res.status(201).json({
            success: true,
            data: newAdmin
        });
    } catch (error) {
        console.log('Error adding admin at addAdminController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signinAdminController = async (req, res) => {
    try {
        const adminData = req.body;
        const { username, password } = adminData;

        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username and password are required'
            });
        }

        const registeredAdmin = await signinAdminService(adminData);

        if(!registeredAdmin) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            });
        }

        const token = generateJwtToken(registeredAdmin.admin_id);

        return res.status(200).cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 86400 * 1000}).json({
            success: true,
            message: 'Admin signed in successfully',
            data: {
                admin: registeredAdmin,
                token: token
            }
        });
    } catch (error) {
        console.log('Error signing in admin at signinAdminController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signoutAdminController = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {httpOnly: true, sameSite: "strict", expires: new Date(0)}).json({
            success: true,
            message: 'Admin signed out successfully'
        });
    } catch (error) {
        console.log('Error signing out admin at signoutAdminController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}