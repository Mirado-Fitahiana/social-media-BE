const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5098/api';

export const URL_LOGIN = `/auth/login`;
export const URL_REGISTER = `/auth/register`;
export const URL_UPDATE_PROFILE = (id: number) => `/user/`;
export const URL_CHANGE_PASSWORD = (id: number) => `/user//password`;
export const URL_DELETE_ACCOUNT = (id: number) => `/user/`;
