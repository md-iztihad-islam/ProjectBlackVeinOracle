import { addGeneralDairyService, getGeneralDairiesByUserIdService, getGeneralDairyByIdService, updateGeneralDairyStatusService } from "../services/gdReportService.js";

export const addGeneralDairyController = async (req, res) => {
    try {
        const dairyData = req.body;
        const userId = req.id;

        if(!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        dairyData.user_id = userId;
        const newDairy = await addGeneralDairyService(dairyData);

        if(!newDairy) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add general dairy'
            });
        }

        return res.status(201).json({
            success: true,
            data: newDairy
        });
    } catch (error) {
        console.log('Error adding general dairy at addGeneralDairyController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getGeneralDairiesByUserIdController = async (req, res) => {
    try {
        const userId = req.id;
        if(!userId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const dairies = await getGeneralDairiesByUserIdService(userId);

        return res.status(200).json({
            success: true,
            data: dairies
        });
    } catch (error) {
        console.log('Error fetching general dairies by user ID at getGeneralDairiesByUserIdController:', error);
        return res.status(500).json({   
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getGeneralDairyByIdController = async (req, res) => {
    try {
        const dairyId = req.params.id;

        const dairy = await getGeneralDairyByIdService(dairyId);

        if(!dairy) {
            return res.status(404).json({
                success: false,
                message: 'General dairy not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: dairy
        });
    } catch (error) {
        console.log('Error fetching general dairy by ID at getGeneralDairyByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const updateGeneralDairyStatusController = async (req, res) => {
    try {
        const dairyId = req.params.id;
        const approvedByOfficerId = req.id;

        if(!approvedByOfficerId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        
        const { status, assignedOfficerId } = req.body;

        const updatedDairy = await updateGeneralDairyStatusService(dairyId, status, approvedByOfficerId, assignedOfficerId);

        if(!updatedDairy) {
            return res.status(400).json({
                success: false,
                message: 'Failed to update general dairy status'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedDairy
        });
    } catch (error) {
        console.log('Error updating general dairy status at updateGeneralDairyStatusController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}