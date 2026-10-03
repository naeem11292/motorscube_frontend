// src/api/auth.api.js
import axios from './axios';
import { ENDPOINTS } from './endpoints';

/**
 * Submit the 6-digit OTP to verify the account
 * @param {Object} data - { email: string, otp: string }
 */
export const verifyOTP = async (data) => {
    const response = await axios.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
    return response.data;
};

/**
 * Request a new OTP code
 * @param {Object} data - { email: string }
 */
export const resendOTP = async (data) => {
    const response = await axios.post(ENDPOINTS.AUTH.RESEND_OTP, data);
    return response.data;
};

// You can add your login/register functions here too:
// export const loginUser = async (data) => { ... }