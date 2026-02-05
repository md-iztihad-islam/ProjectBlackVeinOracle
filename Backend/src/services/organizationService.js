import { addOrganizationRepository } from "../repositories/organizationRepository.js";

export const addOrganizationService = async (organizationData) => {
    try {
        const newOrganization = await addOrganizationRepository(organizationData);
        return newOrganization;
    } catch (error) {
        console.log('Error adding organization at addOrganizationService:', error);
        throw error;
    }
}