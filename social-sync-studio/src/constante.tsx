const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5098/api';

export const URL_LOGIN = `${BASE_URL}/auth/login`;
export const URL_REGISTER = `${BASE_URL}/auth/register`;