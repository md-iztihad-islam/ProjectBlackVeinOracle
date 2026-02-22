// by Rayyan 2.0 — removed dead import getUserByIdRepository
import { addCriminalService, getCriminalByIdService, getCriminalsByThanaIdService, getCriminalFullProfileService, getCriminalTimelineService, recalculateCriminalRiskService, getAllCriminalsService, updateCriminalService, deleteCriminalService, getCriminalsByStatusService, searchCriminalsService, getWantedCriminalsService, getCriminalsByAreaService } from "../services/criminalService.js"; // by Rayyan 2.0

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

export const getCriminalByIdController = async (req, res) => {
    try {
        const criminalId = req.params.criminalid;

        const accessId = req.id;
        if(!accessId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const criminalDetails = await getCriminalByIdService(criminalId);

        if(!criminalDetails || criminalDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Criminal not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: criminalDetails
        });
    } catch (error) {
        console.log('Error fetching criminal by ID at getCriminalByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getCriminalsByThanaIdController = async (req, res) => {
    try {
        const { thanaId } = req.params;
        
        if(!thanaId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        const criminals = await getCriminalsByThanaIdService(thanaId);

        if(!criminals || criminals.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No criminals found for the specified thana'
            });
        }

        return res.status(200).json({
            success: true,
            data: criminals
        });
    } catch (error) {
        console.log('Error fetching criminals by thana ID at getCriminalsByThanaIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}



export const getCriminalFullProfileController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getCriminalFullProfileService(id);
        if (!data) return res.status(404).json({ success: false, message: "Criminal not found" });
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalFullProfileController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getCriminalTimelineController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await getCriminalTimelineService(id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at getCriminalTimelineController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const recalculateCriminalRiskController = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await recalculateCriminalRiskService(id);
        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.log("Error at recalculateCriminalRiskController:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export const getAllCriminalsController = async (req, res) => {
    try {
        const criminals = await getAllCriminalsService();

        if (!criminals || criminals.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No criminals found'
            });
        }

        return res.status(200).json({
            success: true,
            data: criminals
        });
    } catch (error) {
        console.log('Error at getAllCriminalsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const updateCriminalController = async (req, res) => {
    try {
        const { criminalId } = req.params;
        const data = req.body;

        if (!criminalId) {
            return res.status(400).json({
                success: false,
                message: 'Criminal ID is required'
            });
        }

        const updatedCriminal = await updateCriminalService(criminalId, data);

        if (!updatedCriminal) {
            return res.status(404).json({
                success: false,
                message: 'Criminal not found or update failed'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedCriminal
        });
    } catch (error) {
        console.log('Error at updateCriminalController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const deleteCriminalController = async (req, res) => {
    try {
        const { criminalId } = req.params;

        if (!criminalId) {
            return res.status(400).json({
                success: false,
                message: 'Criminal ID is required'
            });
        }

        const deletedCriminal = await deleteCriminalService(criminalId);

        if (!deletedCriminal) {
            return res.status(404).json({
                success: false,
                message: 'Criminal not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: deletedCriminal
        });
    } catch (error) {
        console.log('Error at deleteCriminalController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const getCriminalsByStatusController = async (req, res) => {
    try {
        const { status } = req.params;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Status is required'
            });
        }

        const criminals = await getCriminalsByStatusService(status);

        return res.status(200).json({
            success: true,
            data: criminals
        });
    } catch (error) {
        console.log('Error at getCriminalsByStatusController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const searchCriminalsController = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const criminals = await searchCriminalsService(q);

        return res.status(200).json({
            success: true,
            data: criminals
        });
    } catch (error) {
        console.log('Error at searchCriminalsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const getWantedCriminalsController = async (req, res) => {
    try {
        const criminals = await getWantedCriminalsService();

        return res.status(200).json({
            success: true,
            data: criminals
        });
    } catch (error) {
        console.log('Error at getWantedCriminalsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


export const getCriminalsByAreaController = async (req, res) => {
    try {
        const { district } = req.params;

        if (!district) {
            return res.status(400).json({
                success: false,
                message: 'District is required'
            });
        }

        const criminals = await getCriminalsByAreaService(district);

        return res.status(200).json({
            success: true,
            data: criminals
        });
    } catch (error) {
        console.log('Error at getCriminalsByAreaController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};