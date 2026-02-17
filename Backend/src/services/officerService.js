import { addOfficerRepository, getAllOfficersRepository, getOfficerByEmailRepository, getOfficerByThanaIdRepository } from "../repositories/officerRepository.js";
import bcrypt from 'bcryptjs';

export const addOfficerService = async (officerData) => {
    try {
        const { password } = officerData;
        const hashedPassword = await bcrypt.hash(password, 10);
        officerData.password = hashedPassword;
        const newOfficer = await addOfficerRepository(officerData);
        return newOfficer;
    } catch (error) {
        console.log('Error adding officer at addOfficerService:', error);
        throw error;
    }
}

export const signinOfficerService = async (email, password) => {
    try {
        const officer = await getOfficerByEmailRepository(email);

        if(!officer) {
            throw new Error('Officer not found');
        }

        const isPasswordValid = await bcrypt.compare(password, officer.password);

        if(!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return officer;
    } catch (error) {
        console.log('Error signing in officer at signinOfficerService:', error);
        throw error;
    }
}

export const getAllOfficersService = async () => {
    try {
        const officers = await getAllOfficersRepository();
        return officers;
    } catch (error) {
        console.log('Error fetching all officers at getAllOfficersService:', error);
        throw error;
    }
}

export const getOfficersByThanaIdService = async (thana_id) => {
    try {
        const officers = await getOfficerByThanaIdRepository(thana_id);
        return officers;
    } catch (error) {
        console.log('Error fetching officers by thana ID at getOfficersByThanaIdService:', error);
        throw error;
    }
}