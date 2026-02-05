import { addUserRepository, getUserByEmailRepository } from "../repositories/userRepository.js";
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

