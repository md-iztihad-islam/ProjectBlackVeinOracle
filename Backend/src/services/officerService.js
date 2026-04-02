import { addOfficerRepository, getAllOfficersRepository, getOfficerByEmailRepository, getOfficerByThanaIdRepository, getOfficersByRankRepository, updateOfficerRepository, deleteOfficerRepository, searchOfficersRepository, getOfficerByIdRepository, resetPasswordRepository, getOfficerAnalyticsRepository } from "../repositories/officerRepository.js"; 
import bcrypt from 'bcryptjs';
import { sendOfficerOnboardingEmail } from "../utils/mailer.js";

const VALID_GENDERS = ["male", "female", "other"];

export const addOfficerService = async (officerData) => {
    try {
        if (!officerData?.birth_date || !officerData?.gender) {
            throw new Error("birth_date and gender are required");
        }

        const { password } = officerData;
        const plainPassword = password;
        const hashedPassword = await bcrypt.hash(password, 10);
        officerData.password = hashedPassword;

        if (officerData.birth_date) {
            const parsedBirthDate = new Date(officerData.birth_date);
            if (Number.isNaN(parsedBirthDate.getTime()) || parsedBirthDate > new Date()) {
                throw new Error("Invalid birth_date");
            }
        }

        if (officerData.gender) {
            const normalizedGender = String(officerData.gender).trim().toLowerCase();
            if (!VALID_GENDERS.includes(normalizedGender)) {
                throw new Error("Invalid gender");
            }
            officerData.gender = normalizedGender;
        }

        const newOfficer = await addOfficerRepository(officerData);

        try {
            await sendOfficerOnboardingEmail({
                to: newOfficer.email,
                officerId: newOfficer.officer_id,
                fullName: newOfficer.full_name,
                badgeNo: newOfficer.badge_no,
                rankCode: newOfficer.rank_code,
                thanaId: newOfficer.thana_id,
                nidNumber: newOfficer.nid_number,
                fatherName: newOfficer.father_name,
                motherName: newOfficer.mother_name,
                birthDate: newOfficer.birth_date,
                gender: newOfficer.gender,
                age: newOfficer.age,
                imageUrl: newOfficer.image_url,
                loginEmail: newOfficer.email,
                plainPassword,
            });
        } catch (emailError) {
            console.log("Failed to send officer onboarding email:", emailError?.message || emailError);
        }

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

// by Rayyan 2.0
export const getOfficersByRankService = async (rankId) => {
    try {
        const officers = await getOfficersByRankRepository(rankId);
        return officers;
    } catch (error) {
        console.log('Error fetching officers by rank at getOfficersByRankService:', error);
        throw error;
    }
}

export const updateOfficerService = async (officerId, data) => {
    try {
        if (data.birth_date) {
            const parsedBirthDate = new Date(data.birth_date);
            if (Number.isNaN(parsedBirthDate.getTime()) || parsedBirthDate > new Date()) {
                throw new Error("Invalid birth_date");
            }
        }

        if (typeof data.gender !== "undefined") {
            const normalizedGender = String(data.gender || "").trim().toLowerCase();
            if (!VALID_GENDERS.includes(normalizedGender)) {
                throw new Error("Invalid gender");
            }
            data.gender = normalizedGender;
        }

        const updatedOfficer = await updateOfficerRepository(officerId, data);
        return updatedOfficer;
    } catch (error) {
        console.log('Error updating officer at updateOfficerService:', error);
        throw error;
    }
}

export const deleteOfficerService = async (officerId) => {
    try {
        const deletedOfficer = await deleteOfficerRepository(officerId);
        return deletedOfficer;
    } catch (error) {
        console.log('Error deleting officer at deleteOfficerService:', error);
        throw error;
    }
}

export const searchOfficersService = async (searchTerm) => {
    try {
        const officers = await searchOfficersRepository(searchTerm);
        return officers;
    } catch (error) {
        console.log('Error searching officers at searchOfficersService:', error);
        throw error;
    }
}

export const getOfficerByIdService = async (officerId) => {
    try {
        const officer = await getOfficerByIdRepository(officerId);
        return officer;
    } catch (error) {
        console.log('Error fetching officer by ID at getOfficerByIdService:', error);
        throw error;
    }
}

export const resetPasswordService = async (officerId, current_password, new_password) => {
    try {
        const officer = await getOfficerByIdRepository(officerId);

        console.log('Officer fetched for password reset:', officer);
        console.log('Current Password Provided:', current_password);
        console.log('New Password Provided:', new_password);

        if (!officer) {
            throw new Error('Officer not found');
        }

        const isOldPasswordValid = await bcrypt.compare(current_password, officer.password);

        if (!isOldPasswordValid) {
            throw new Error('Old password is incorrect');
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);
        const updatedOfficer = await resetPasswordRepository(officerId, hashedPassword);
        return updatedOfficer;
    } catch (error) {
        console.log('Error resetting officer password at resetPasswordService:', error);
        throw error;
    }
}

export const getOfficerAnalyticsService = async (thanaId, district, gender, rank) => {
    try {
        const data = await getOfficerAnalyticsRepository(thanaId, district, gender, rank);
        return data;
    } catch (error) {
        console.log('Error fetching officer analytics at getOfficerAnalyticsService:', error);
        throw error;
    }
}