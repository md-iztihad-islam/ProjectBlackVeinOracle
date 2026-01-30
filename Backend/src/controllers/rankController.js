import { addRankService } from "../services/rankService.js";

export const addReankController = async (req, res) => {
    try {
        const rankData = req.body;
        const newRank = await addRankService(rankData);

        if(!newRank) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add new rank'
            });
        }

        return res.status(201).json({
            success: true,
            data: newRank
        });
    } catch (error) {
        console.log('Error adding rank at addRankController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}