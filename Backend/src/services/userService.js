import { addUserRepository, getUserByEmailRepository, getUserByIdRepository, getAllUsersRepository, updateUserRepository, deleteUserRepository } from "../repositories/userRepository.js"; 
import bcrypt from 'bcryptjs';

const VALID_GENDERS = ["male", "female", "other"];

const normalizeUserProfileFields = (payload = {}, { requireProfile = false } = {}) => {
    if (requireProfile && (!payload.birth_date || !payload.gender)) {
        throw new Error("birth_date and gender are required");
    }

    if (typeof payload.birth_date !== "undefined") {
        const parsedBirthDate = new Date(payload.birth_date);
        if (Number.isNaN(parsedBirthDate.getTime()) || parsedBirthDate > new Date()) {
            throw new Error("Invalid birth_date");
        }
    }

    if (typeof payload.gender !== "undefined") {
        const normalizedGender = String(payload.gender || "").trim().toLowerCase();
        if (!VALID_GENDERS.includes(normalizedGender)) {
            throw new Error("Invalid gender");
        }
        payload.gender = normalizedGender;
    }
};

export const addUserService = async (userData) => {
    try {
        normalizeUserProfileFields(userData, { requireProfile: true });
        const { password } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        userData.password = hashedPassword;
        const newUser = await addUserRepository(userData);
        return newUser;
    } catch (error) {
        console.log('Error adding user at addUserService:', error);
        throw error;
    }
}

export const signinUserService = async (email, password) => {
    try {
        const user = await getUserByEmailRepository(email);

        if(!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return user;
    } catch (error) {
        console.log('Error signing in user at signinUserService:', error);
        throw error;
    }
}


export const getUserByIdService = async (userId) => {
    try {
        const user = await getUserByIdRepository(userId);
        return user;
    } catch (error) {
        console.log('Error fetching user by ID at getUserByIdService:', error);
        throw error;
    }
}


export const getAllUsersService = async () => {
    try {
        const users = await getAllUsersRepository();
        return users;
    } catch (error) {
        console.log('Error fetching all users at getAllUsersService:', error);
        throw error;
    }
}


export const updateUserService = async (userId, data) => {
    try {
        normalizeUserProfileFields(data, { requireProfile: false });
        const updatedUser = await updateUserRepository(userId, data);
        return updatedUser;
    } catch (error) {
        console.log('Error updating user at updateUserService:', error);
        throw error;
    }
}


export const deleteUserService = async (userId) => {
    try {
        const deletedUser = await deleteUserRepository(userId);
        return deletedUser;
    } catch (error) {
        console.log('Error deleting user at deleteUserService:', error);
        throw error;
    }
}
