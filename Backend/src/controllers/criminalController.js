import { addCriminalService } from "../services/criminalService.js";

export const addCriminalController = async (req, res) => {
    try {
        const criminalData = req.body;
        const thanaId = req.id;

        if(!thanaId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        criminalData.registered_thana_id = thanaId;
        const newCriminal = await addCriminalService(criminalData);

        if(!newCriminal) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add criminal'
            });
        }

        return res.status(201).json({
            success: true,
            data: newCriminal
        });
    } catch (error) {
        console.log('Error adding criminal at addCriminalController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}