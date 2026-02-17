import { addJailRepository, getAllJailsRepository, getJailByDistrictRepository, getJailByEmailRepository, getJailByIdRepository, getJailByNameRepository, getJailByZoneRepository } from "../repositories/jailRepository.js";
import bcrypt from 'bcryptjs';

export const addJailService = async (jailData) => {
    try {
        const { password } = jailData;
        const hashedPassword = await bcrypt.hash(password, 10);
        jailData.password = hashedPassword;
        const newJail = await addJailRepository(jailData);
        return newJail;
    } catch (error) {
        console.log('Error adding jail at addJailService:', error);
        throw error;
    }
}

export const signinJailService = async (jailData) => {
    try {
        const jail = await getJailByEmailRepository(jailData.email);

        if (!jail) {
            throw new Error('Jail not found');
        }

        const isPasswordValid = await bcrypt.compare(jailData.password, jail.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        return jail;
    } catch (error) {
        console.log('Error signing in jail at signinJailService:', error);
        throw error;
    }
}

export const getAllJailsService = async () => {
    try {
        const jails = await getAllJailsRepository();
        return jails;
    } catch (error) {
        console.log('Error fetching jails at getAllJailsService:', error);
        throw error;
    }
}

export const getJailByIdService = async (jailId) => {
    try {
        const jail = await getJailByIdRepository(jailId);
        return jail;
    } catch (error) {
        console.log('Error fetching jail by ID at getJailByIdService:', error);
        throw error;
    }
}

export const getJailByNameService = async (jailName) => {
    try {
        const jails = await getJailByNameRepository(jailName);  
        return jails;
    } catch (error) {
        console.log('Error fetching jail by name at getJailByNameService:', error);
        throw error;
    }
}

export const getJailByZoneService = async (zone) => {
    try {
        const jails = await getJailByZoneRepository(zone);
        return jails;
    } catch (error) {
        console.log('Error fetching jail by zone at getJailByZoneService:', error);
        throw error;
    }
}

export const getJailByDistrictService = async (district) => {
    try {
        const jails = await getJailByDistrictRepository(district);
        return jails;
    } catch (error) {
        console.log('Error fetching jail by district at getJailByDistrictService:', error);
        throw error;
    }
}