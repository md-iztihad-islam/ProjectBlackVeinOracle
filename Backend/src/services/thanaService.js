import { addHeadOfficerToThanaRepository, addThanaRepository, getAllThanasRepository, getThanaByDistrictRepository, getThanaByEmail, getThanaByIdRepository, updateThanaRepository, deleteThanaRepository, geThanaByNameRepository } from "../repositories/thanaRepository.js"; // by Rayyan 2.0
import bcrypt from 'bcryptjs';

export const addThanaService = async (thanaData, admin_id) => {
    try {
        const { password } = thanaData;
        const hashedPassword = await bcrypt.hash(password, 10);
        thanaData.password = hashedPassword;
        thanaData.created_by_admin_id = admin_id;
        const newThana = await addThanaRepository(thanaData);
        return newThana;
    } catch (error) {
        console.log('Error adding thana at addThanaService:', error);
        throw error;
    }
}

export const signinThanaService = async (email, password) => {
    try {
        const thana = await getThanaByEmail(email);

        if(!thana) {
            throw new Error('Thana not found');
        }

        const isPasswordValid = await bcrypt.compare(password, thana.password);

        if(!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return thana;
    } catch (error) {
        console.log('Error signing in thana at signinThanaService:', error);
        throw error;
    }
}

export const addHeadOfficerToThanaService = async (thana_id, head_officer_id) => {
    try {
        const updatedThana = await addHeadOfficerToThanaRepository(thana_id, head_officer_id);
        return updatedThana;
    } catch (error) {
        console.log('Error adding head officer to thana at addHeadOfficerToThanaService:', error);
        throw error;
    }
}

export const getThanasByDistrictService = async (district) => {
    try {
        const thanas = await getThanaByDistrictRepository(district);
        return thanas;
    } catch (error) {
        console.log('Error fetching thanas by district at getThanasByDistrictService:', error);
        throw error;
    }
}


export const getAllThanasService = async () => {
    try {
        const thanas = await getAllThanasRepository();
        return thanas;
    } catch (error) {
        console.log('Error fetching all thanas at getAllThanasService:', error);
        throw error;
    }
}


export const getThanaByIdService = async (thanaId) => {
    try {
        const thana = await getThanaByIdRepository(thanaId);
        return thana;
    } catch (error) {
        console.log('Error fetching thana by ID at getThanaByIdService:', error);
        throw error;
    }
}


export const updateThanaService = async (thanaId, data) => {
    try {
        const updatedThana = await updateThanaRepository(thanaId, data);
        return updatedThana;
    } catch (error) {
        console.log('Error updating thana at updateThanaService:', error);
        throw error;
    }
}


export const deleteThanaService = async (thanaId) => {
    try {
        const deletedThana = await deleteThanaRepository(thanaId);
        return deletedThana;
    } catch (error) {
        console.log('Error deleting thana at deleteThanaService:', error);
        throw error;
    }
}

export const getThanaByNameService = async (name) => {
    try {
        const thana = await geThanaByNameRepository(name);
        return thana;
    } catch (error) {
        console.log('Error fetching thana by name at getThanaByNameService:', error);
        throw error;
    }
}