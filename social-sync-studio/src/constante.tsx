// Configuration de base
export const BASE_URL: string = import.meta.env.VITE_BASE_URL || 'http://localhost:5098';

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================
export const REGISTER_URL = `${BASE_URL}/api/auth/register`;
export const LOGIN_URL = `${BASE_URL}/api/auth/login`;

// ============================================
// USER ENDPOINTS
// ============================================
export const UPDATE_PROFILE_URL = `${BASE_URL}/api/user/update-profile`;
export const CHANGE_PASSWORD_URL = `${BASE_URL}/api/user/change-password`;
export const DELETE_ACCOUNT_URL = `${BASE_URL}/api/user/delete-account`;

// ============================================
// POST ENDPOINTS
// ============================================
export const POST_URL = `${BASE_URL}/api/post`;
export const GET_POSTS_URL = `${BASE_URL}/api/post`;
export const GET_POST_URL = (id: number) => `${BASE_URL}/api/post/${id}`;
export const UPDATE_POST_URL = (id: number) => `${BASE_URL}/api/post/${id}`;
export const DELETE_POST_URL = (id: number) => `${BASE_URL}/api/post/${id}`;

// ============================================
// SOCIAL MEDIA ENDPOINTS
// ============================================
export const SOCIAL_MEDIA_URL = `${BASE_URL}/api/socialmedia`;
export const GET_SOCIAL_MEDIA_URL = (id: number) => `${BASE_URL}/api/socialmedia/${id}`;

// ============================================
// DEPRECATED - Anciens endpoints (à supprimer après migration)
// ============================================
// export const URL_LOGIN = BASE_URL + `/auth/login`; 
// export const URL_REGISTER = BASE_URL + `/auth/register`;
// export const URL_UPDATE_PROFILE = (id: number) => BASE_URL + `/user/${id}`;
// export const URL_CHANGE_PASSWORD = (id: number) => BASE_URL + `/user/${id}/password`;
// export const URL_DELETE_ACCOUNT = (id: number) => BASE_URL + `/user/${id}`;