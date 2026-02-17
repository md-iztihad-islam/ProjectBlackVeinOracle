import axios from "axios";
import { API_URL } from "./constants";

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    }
});

export default axiosInstance;

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem("token", token);
    } else {
        localStorage.removeItem("token");
    }
}