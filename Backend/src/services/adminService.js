import { addAdminRepository, getAdminByUsername } from "../repositories/adminRepository.js";
import bcrypt from 'bcryptjs';

export const addAdminService = async (adminData) => {
    try {
        const { password } = adminData;
        const hashedPassword = await bcrypt.hash(password, 10);
        adminData.password = hashedPassword;
        const newAdmin = await addAdminRepository(adminData);
        return newAdmin;
    } catch (error) {
        console.log('Error adding admin at addAdminService:', error);
        throw error;
    }
}

export const signinAdminService = async (adminData) => {
    try {
        const admin = await getAdminByUsername(adminData.username);
        if (!admin) {
            throw new Error('Admin not found');
        }

        const isPasswordValid = await bcrypt.compare(adminData.password, admin.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return admin;
    } catch (error) {
        console.log('Error signing in admin at signinAdminService:', error);
        throw error;
    }
}