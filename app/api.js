function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to parse JWT:", e);
        return null;
    }
}

function isTokenExpired(token) {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        return true; // If there's no exp claim, consider the token expired
    }
    const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
    return new Date().getTime() > expiryTime;
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post('https://api.aperol.life/auth/refresh', {
        refresh_token: refreshToken,
    });

    if (response.status !== 200) {
        throw new Error('Failed to refresh token');
    }

    const data = response.data;

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    const expiryTime = new Date().getTime() + data.expires_in * 1000;
    localStorage.setItem('token_expiry', expiryTime);

    return data.access_token;
}

import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.aperol.life',
});

axiosInstance.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('token');

        if (token && isTokenExpired(token)) {
            try {
                token = await refreshAccessToken();
            } catch (error) {
                console.error('Unable to refresh token:', error);
                // Optionally handle the refresh failure, e.g., redirect to login
                return Promise.reject(error);
            }
        }

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
