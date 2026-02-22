import { addUserRepository, getUserByEmailRepository, getUserByIdRepository, getAllUsersRepository, updateUserRepository, deleteUserRepository } from "../repositories/userRepository.js"; 
import bcrypt from 'bcryptjs';

export const addUserService = async (userData) => {
    try {
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
