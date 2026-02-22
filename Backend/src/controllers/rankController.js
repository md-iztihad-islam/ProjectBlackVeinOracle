import { addRankService, getAllRanksService, getRankByIdService, updateRankService, deleteRankService } from "../services/rankService.js";

export const addRankController = async (req, res) => {
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

// by Rayyan 2.0

export const getAllRanksController = async (req, res) => {
    try {
        const ranks = await getAllRanksService();

        if (!ranks || ranks.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No ranks found'
            });
        }

        return res.status(200).json({
            success: true,
            data: ranks
        });
    } catch (error) {
        console.log('Error fetching all ranks at getAllRanksController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getRankByIdController = async (req, res) => {
    try {
        const { rankId } = req.params;

        if (!rankId) {
            return res.status(400).json({
                success: false,
                message: 'Rank ID is required'
            });
        }

        const rank = await getRankByIdService(rankId);

        if (!rank) {
            return res.status(404).json({
                success: false,
                message: 'Rank not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: rank
        });
    } catch (error) {
        console.log('Error fetching rank by ID at getRankByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateRankController = async (req, res) => {
    try {
        const { rankId } = req.params;
        const data = req.body;
        const updatedRank = await updateRankService(rankId, data);

        if (!updatedRank) {
            return res.status(404).json({
                success: false,
                message: 'Rank not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedRank
        });
    } catch (error) {
        console.log('Error updating rank at updateRankController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteRankController = async (req, res) => {
    try {
        const { rankId } = req.params;
        const deletedRank = await deleteRankService(rankId);

        if (!deletedRank) {
            return res.status(404).json({
                success: false,
                message: 'Rank not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Rank deleted successfully',
            data: deletedRank
        });
    } catch (error) {
        console.log('Error deleting rank at deleteRankController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}