// src/api/endpoints.js

export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        VERIFY_OTP: '/auth/verify-otp',       // The route to submit the 6-digit code
        RESEND_OTP: '/auth/resend-otp',       // The route to request a new code
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    // Add other modules here as your app grows (e.g., USER, DASHBOARD)
};