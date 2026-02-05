import { addUserService, signinUserService } from "../services/userService.js";
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
