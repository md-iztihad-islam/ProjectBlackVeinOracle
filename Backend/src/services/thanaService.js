import { addHeadOfficerToThanaRepository, addThanaRepository, getThanaByEmail } from "../repositories/thanaRepository.js";
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