import { v2 as cloudinary } from "cloudinary";
import {
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_CLOUD_NAME,
} from "../config/serverConfig.js";

const hasRealValue = (v) => {
    const value = String(v || "").trim();
    if (!value) return false;
    const normalized = value.toLowerCase();
    return !normalized.includes("your_")
        && !normalized.includes("your-")
        && !normalized.includes("placeholder")
        && !normalized.includes("<")
        && !normalized.includes(">");
};

const isConfigured = () => hasRealValue(CLOUDINARY_CLOUD_NAME)
    && hasRealValue(CLOUDINARY_API_KEY)
    && hasRealValue(CLOUDINARY_API_SECRET);

let configured = false;

const ensureConfigured = () => {
    if (!isConfigured()) return false;

    if (!configured) {
        cloudinary.config({
            cloud_name: CLOUDINARY_CLOUD_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET,
            secure: true,
        });
        configured = true;
    }

    return true;
};

export const isImageDataUrl = (value) => /^data:image\/[a-zA-Z0-9.+-]+;base64,/.test(String(value || "").trim());

export const uploadImageToCloudinary = async (imageInput, folder = "black-vein-oracle") => {
    const ready = ensureConfigured();
    if (!ready) return null;

    const input = String(imageInput || "").trim();
    if (!input) return null;

    const result = await cloudinary.uploader.upload(input, {
        folder,
        resource_type: "image",
        overwrite: false,
    });

    return result?.secure_url || null;
};

export const normalizeImageUrl = async ({ imageUrl, folder }) => {
    const raw = String(imageUrl || "").trim();
    if (!raw) return raw;

    if (raw.includes("res.cloudinary.com")) return raw;

    if (isImageDataUrl(raw) || /^https?:\/\//i.test(raw)) {
        const uploadedUrl = await uploadImageToCloudinary(raw, folder);
        return uploadedUrl || raw;
    }

    return raw;
};
