import { addJailService, getAllJailsService, getJailByIdService } from "../services/jailService.js";

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