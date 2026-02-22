import { addAdminRepository, getAdminByUsername, getAllAdminsRepository, getAdminByIdRepository, updateAdminRepository, deleteAdminRepository } from "../repositories/adminRepository.js";
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

// by Rayyan 2.0
export const getAllAdminsService = async () => {
    try {
        const admins = await getAllAdminsRepository();
        return admins;
    } catch (error) {
        console.log('Error fetching all admins at getAllAdminsService:', error);
        throw error;
    }
}


export const getAdminByIdService = async (adminId) => {
    try {
        const admin = await getAdminByIdRepository(adminId);
        return admin;
    } catch (error) {
        console.log('Error fetching admin by ID at getAdminByIdService:', error);
        throw error;
    }
}


export const updateAdminService = async (adminId, data) => {
    try {
        const updatedAdmin = await updateAdminRepository(adminId, data);
        return updatedAdmin;
    } catch (error) {
        console.log('Error updating admin at updateAdminService:', error);
        throw error;
    }
}


export const deleteAdminService = async (adminId) => {
    try {
        const deletedAdmin = await deleteAdminRepository(adminId);
        return deletedAdmin;
    } catch (error) {
        console.log('Error deleting admin at deleteAdminService:', error);
        throw error;
    }
}