import { addAdminService, signinAdminService, getAllAdminsService, getAdminByIdService, updateAdminService, deleteAdminService } from "../services/adminService.js";
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
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
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
                user: registeredAdmin,
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

// by Rayyan 2.0
export const getAllAdminsController = async (req, res) => {
    try {
        const admins = await getAllAdminsService();
        return res.status(200).json({ success: true, data: admins });
    } catch (error) {
        console.log("Error at getAllAdminsController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getAdminByIdController = async (req, res) => {
    try {
        const { adminId } = req.params;
        const admin = await getAdminByIdService(adminId);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.log('Error fetching admin by ID at getAdminByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const updateAdminController = async (req, res) => {
    try {
        const { adminId } = req.params;
        const data = req.body;
        const updatedAdmin = await updateAdminService(adminId, data);

        if (!updatedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedAdmin
        });
    } catch (error) {
        console.log('Error updating admin at updateAdminController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const deleteAdminController = async (req, res) => {
    try {
        const { adminId } = req.params;
        const deletedAdmin = await deleteAdminService(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Admin deleted successfully',
            data: deletedAdmin
        });
    } catch (error) {
        console.log('Error deleting admin at deleteAdminController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};