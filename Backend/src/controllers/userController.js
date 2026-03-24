import { addUserService, getUserByIdService, signinUserService, getAllUsersService, updateUserService, deleteUserService } from "../services/userService.js"; 
import { generateJwtToken } from "../utils/jwtToken.js";

export const addUserController = async (req, res) => {
    try {
        const userData = req.body;
        const newUser = await addUserService(userData);

        if(!newUser) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add new user'
            });
        }

        return res.status(201).json({
            success: true,
            data: newUser
        });
    } catch (error) {
        console.log('Error adding user at addUserController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signinUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const user = await signinUserService(email, password);

        if(!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateJwtToken(user.user_id);

        return res.status(200).cookie("token", token, {httpOnly: true, sameSite: "strict", maxAge: 86400 * 1000}).json({
            success: true,
            message: 'User signed in successfully',
            data: {
                user: user,
                token: token
            }
        })
    } catch (error) {
        console.log('Error signing in user at signinUserController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signoutUserController = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {httpOnly: true, sameSite: "strict", maxAge: 0}).json({
            success: true,
            message: 'User signed out successfully'
        });
    } catch (error) {
        console.log('Error signing out user at signoutUserController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// by Rayyan 2.0

export const getUserByIdController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const user = await getUserByIdService(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.log('Error fetching user by ID at getUserByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getAllUsersController = async (req, res) => {
    try {
        const users = await getAllUsersService();

        if (!users || users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No users found'
            });
        }

        return res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.log('Error fetching all users at getAllUsersController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateUserController = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = req.body;

        console.log('Received request to update user with ID:', userId, 'and data:', data);

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const updatedUser = await updateUserService(userId, data);

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found or update failed'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.log('Error updating user at updateUserController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteUserController = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        const deletedUser = await deleteUserService(userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedUser
        });
    } catch (error) {
        console.log('Error deleting user at deleteUserController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}