import { Configuration, MvgApi } from './ts-client';
import axios from 'axios';


function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Failed to parse JWT:', e);
        return null;
    }
}

function isTokenExpired(token: string) {
    const decodedToken = parseJwt(token);
    if (!decodedToken || !decodedToken.exp) {
        return true;
    }
    const expiryTime = decodedToken.exp * 1000;
    return new Date().getTime() > expiryTime;
}

async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('No refresh token available');
    }

    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
    });

    if (response.status !== 200) {
        throw new Error('Failed to refresh token');
    }

    const data = response.data;

    localStorage.setItem('token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    const expiryTime = new Date().getTime() + data.expires_in * 1000;
    localStorage.setItem('token_expiry', expiryTime.toString());

    return data.access_token;
}

const apiConfig = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL,
  accessToken: async () => {
    let token = localStorage.getItem('token');

    if (token && isTokenExpired(token)) {
      try {
        token = await refreshAccessToken();
      } catch (error) {
        console.error('Unable to refresh token:', error);
        throw error;
      }
    }

    if (!token) {
      throw new Error('No token available');
    }

    return `Bearer ${token}`;
  },
});

export const mvgApi = new MvgApi(apiConfig);
