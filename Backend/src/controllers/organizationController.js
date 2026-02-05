import { addOrganizationService } from "../services/organizationService.js";

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
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}