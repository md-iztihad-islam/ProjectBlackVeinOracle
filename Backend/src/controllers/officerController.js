import { addOfficerService, signinOfficerService } from "../services/officerService.js";
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
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const signinOfficerController = async (req, res) => {
    try {
        console.log('Signin Officer Request Body:', req.body); // Debugging line    
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
                officer: officer,
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