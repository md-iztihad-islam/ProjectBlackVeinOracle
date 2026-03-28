import { addGeneralDairyService, getGeneralDairiesByUserIdService, getGeneralDairyByIdService, updateGeneralDairyStatusService, getAllGeneralDairiesService, getGeneralDairiesByThanaService, deleteGeneralDairyService } from "../services/gdReportService.js"; 

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
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getGeneralDairiesByUserIdController = async (req, res) => {
    try {
        const userId = req.id;
        console.log('Received request to get general dairies by user ID with userId:', userId);
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
        const { dairyId } = req.params;

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
        const { dairyId } = req.params;
        const actorId = req.id;

        if(!actorId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        // Only officer IDs should be written into approved_by_officer_id (FK -> officer.officer_id).
        // For thana/admin updates keep existing approved_by_officer_id unchanged.
        const approvedByOfficerId = req.role === 'officer' ? actorId : null;

        
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
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') {
            const detail = String(error.detail || '');
            if (detail.includes('assigned_officer_id')) {
                return res.status(400).json({ success: false, message: 'Selected officer does not exist' });
            }
            if (detail.includes('approved_by_officer_id')) {
                return res.status(400).json({ success: false, message: 'Only officer accounts can be used as approver' });
            }
            return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// by Rayyan 2.0
export const getAllGeneralDairiesController = async (req, res) => {
    try {
        const dairies = await getAllGeneralDairiesService();

        if (!dairies || dairies.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No general dairies found'
            });
        }

        return res.status(200).json({
            success: true,
            data: dairies
        });
    } catch (error) {
        console.log('Error fetching all general dairies at getAllGeneralDairiesController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getGeneralDairiesByThanaController = async (req, res) => {
    try {
        const { thanaId } = req.params;

        if (!thanaId) {
            return res.status(400).json({
                success: false,
                message: 'Thana ID is required'
            });
        }

        const dairies = await getGeneralDairiesByThanaService(thanaId);

        return res.status(200).json({
            success: true,
            data: dairies
        });
    } catch (error) {
        console.log('Error fetching general dairies by thana at getGeneralDairiesByThanaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteGeneralDairyController = async (req, res) => {
    try {
        const { dairyId } = req.params;

        if (!dairyId) {
            return res.status(400).json({
                success: false,
                message: 'Dairy ID is required'
            });
        }

        const deletedDairy = await deleteGeneralDairyService(dairyId);

        if (!deletedDairy) {
            return res.status(404).json({
                success: false,
                message: 'General dairy not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedDairy
        });
    } catch (error) {
        console.log('Error deleting general dairy at deleteGeneralDairyController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}