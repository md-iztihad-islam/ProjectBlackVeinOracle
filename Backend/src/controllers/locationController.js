import { addLocationService } from "../services/locationService.js";

export const addLocationController = async (req, res) => {
    try {
        const locationData = req.body;

        const id = req.id;

        if(!id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: No ID provided'
            });
        }
        
        const newLocation = await addLocationService(locationData);

        res.status(201).json({
            success: true,
            message: 'Location added successfully',
            data: newLocation
        });
    } catch (error) {
        console.log('Error adding location at addLocationController:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while adding the location'
        });
    }
}