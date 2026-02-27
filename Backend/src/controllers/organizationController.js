import { addOrganizationService, getAllOrganizationsService, getOrganizationByIdService, updateOrganizationService, deleteOrganizationService, searchOrganizationsService } from "../services/organizationService.js";

export const addOrganizationController = async (req, res) => {
    try {
        const organizationData = req.body;

        const thanaId = req.id;
        if(!thanaId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized access'
            });
        }
        const newOrganization = await addOrganizationService(organizationData);

        if(!newOrganization) {
            return res.status(400).json({
                success: false,
                message: 'Failed to add organization'
            });
        }

        return res.status(201).json({
            success: true,
            data: newOrganization
        });
    } catch (error) {
        console.log('Error adding organization at addOrganizationController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// by Rayyan 2.0

export const getAllOrganizationsController = async (req, res) => {
    try {
        const organizations = await getAllOrganizationsService();

        if (!organizations || organizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No organizations found'
            });
        }

        return res.status(200).json({
            success: true,
            data: organizations
        });
    } catch (error) {
        console.log('Error fetching all organizations at getAllOrganizationsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}



export const getOrganizationByIdController = async (req, res) => {
    try {
        const { orgId } = req.params;

        if (!orgId) {
            return res.status(400).json({
                success: false,
                message: 'Organization ID is required'
            });
        }

        const organization = await getOrganizationByIdService(orgId);

        if (!organization) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: organization
        });
    } catch (error) {
        console.log('Error fetching organization by ID at getOrganizationByIdController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const updateOrganizationController = async (req, res) => {
    try {
        const { orgId } = req.params;
        const data = req.body;
        const updatedOrganization = await updateOrganizationService(orgId, data);

        if (!updatedOrganization) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }

        return res.status(200).json({
            success: true,
            data: updatedOrganization
        });
    } catch (error) {
        console.log('Error updating organization at updateOrganizationController:', error);
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'A record with these details already exists' });
        if (error.code === '23503') return res.status(400).json({ success: false, message: 'Referenced record does not exist' });
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const deleteOrganizationController = async (req, res) => {
    try {
        const { orgId } = req.params;
        const deletedOrganization = await deleteOrganizationService(orgId);

        if (!deletedOrganization) {
            return res.status(404).json({
                success: false,
                message: 'Organization not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Organization deleted successfully',
            data: deletedOrganization
        });
    } catch (error) {
        console.log('Error deleting organization at deleteOrganizationController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}


export const searchOrganizationsController = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const organizations = await searchOrganizationsService(q);

        if (!organizations || organizations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No organizations found'
            });
        }

        return res.status(200).json({
            success: true,
            data: organizations
        });
    } catch (error) {
        console.log('Error searching organizations at searchOrganizationsController:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}