import { getUserByIdRepository } from "../repositories/userRepository.js";
import { addCriminalService, getCriminalByIdService, getCriminalsByThanaIdService } from "../services/criminalService.js";

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