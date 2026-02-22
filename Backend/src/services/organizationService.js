import { addOrganizationRepository, getAllOrganizationsRepository, getOrganizationByIdRepository, updateOrganizationRepository, deleteOrganizationRepository, searchOrganizationsRepository } from "../repositories/organizationRepository.js";

export const addOrganizationService = async (organizationData) => {
    try {
        const newOrganization = await addOrganizationRepository(organizationData);
        return newOrganization;
    } catch (error) {
        console.log('Error adding organization at addOrganizationService:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getAllOrganizationsService = async () => {
    try {
        const organizations = await getAllOrganizationsRepository();
        return organizations;
    } catch (error) {
        console.log('Error fetching all organizations at getAllOrganizationsService:', error);
        throw error;
    }
}

// by Rayyan 2.0

export const getOrganizationByIdService = async (orgId) => {
    try {
        const organization = await getOrganizationByIdRepository(orgId);
        return organization;
    } catch (error) {
        console.log('Error fetching organization by ID at getOrganizationByIdService:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const updateOrganizationService = async (orgId, data) => {
    try {
        const updatedOrganization = await updateOrganizationRepository(orgId, data);
        return updatedOrganization;
    } catch (error) {
        console.log('Error updating organization at updateOrganizationService:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const deleteOrganizationService = async (orgId) => {
    try {
        const deletedOrganization = await deleteOrganizationRepository(orgId);
        return deletedOrganization;
    } catch (error) {
        console.log('Error deleting organization at deleteOrganizationService:', error);
        throw error;
    }
}

// by Rayyan 2.0
export const searchOrganizationsService = async (searchTerm) => {
    try {
        const organizations = await searchOrganizationsRepository(searchTerm);
        return organizations;
    } catch (error) {
        console.log('Error searching organizations at searchOrganizationsService:', error);
        throw error;
    }
}