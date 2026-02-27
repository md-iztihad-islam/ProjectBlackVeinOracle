import { addLocationService, getAllLocationsService, getLocationByIdService, updateLocationService, deleteLocationService, getLocationsByDistrictService } from "../services/locationService.js";

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
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        res.status(500).json({
            success: false,
            message: 'An error occurred while adding the location'
        });
    }
}

// by Rayyan 2.0

export const getAllLocationsController = async (req, res) => {
    try {
        const locations = await getAllLocationsService();

        if (!locations || locations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No locations found'
            });
        }

        return res.status(200).json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.log('Error fetching all locations at getAllLocationsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getLocationByIdController = async (req, res) => {
    try {
        const { locationId } = req.params;

        if (!locationId) {
            return res.status(400).json({
                success: false,
                message: 'Location ID is required'
            });
        }

        const location = await getLocationByIdService(locationId);

        if (!location) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: location
        });
    } catch (error) {
        console.log('Error fetching location by ID at getLocationByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateLocationController = async (req, res) => {
    try {
        const { locationId } = req.params;
        const data = req.body;
        const updatedLocation = await updateLocationService(locationId, data);

        if (!updatedLocation) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedLocation
        });
    } catch (error) {
        console.log('Error updating location at updateLocationController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteLocationController = async (req, res) => {
    try {
        const { locationId } = req.params;
        const deletedLocation = await deleteLocationService(locationId);

        if (!deletedLocation) {
            return res.status(404).json({
                success: false,
                message: 'Location not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Location deleted successfully',
            data: deletedLocation
        });
    } catch (error) {
        console.log('Error deleting location at deleteLocationController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const getLocationsByDistrictController = async (req, res) => {
    try {
        const { district } = req.params;
        const locations = await getLocationsByDistrictService(district);

        if (!locations || locations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No locations found in this district'
            });
        }

        return res.status(200).json({
            success: true,
            data: locations
        });
    } catch (error) {
        console.log('Error fetching locations by district at getLocationsByDistrictController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}