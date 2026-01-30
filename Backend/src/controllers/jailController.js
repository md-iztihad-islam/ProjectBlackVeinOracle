import { addJailService } from "../services/jailService.js";

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