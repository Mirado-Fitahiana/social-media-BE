import axios from './axios';
import {
  POST_URL,
  GET_POSTS_URL,
  GET_POST_URL,
  UPDATE_POST_URL,
  DELETE_POST_URL,
  SOCIAL_MEDIA_URL,
  GET_SOCIAL_MEDIA_URL
} from '@/constante';

// Types
export interface SocialMedia {
  id: number;
  platform: string;
  iconLogo: string | null;
  description: string | null;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  socialMediaId: number;
  title: string;
  content: string;
  pathFile: string | null;
  createdAt: string;
  username?: string;
  email?: string;
  platform?: string;
}

export interface CreatePostData {
  socialMediaId: number;
  title: string;
  content: string;
  file?: File;
}

export interface UpdatePostData {
  socialMediaId?: number;
  title?: string;
  content?: string;
  file?: File;
}

// Social Media API
export const socialMediaApi = {
  getAll: async (): Promise<SocialMedia[]> => {
    const response = await axios.get(SOCIAL_MEDIA_URL);
    return response.data.socialMedias;
  },

  getById: async (id: number): Promise<SocialMedia> => {
    const response = await axios.get(GET_SOCIAL_MEDIA_URL(id));
    return response.data.socialMedia;
  }
};

// Post API
export const postApi = {
  create: async (data: CreatePostData) => {
    const formData = new FormData();
    formData.append('socialMediaId', data.socialMediaId.toString());
    formData.append('title', data.title);
    formData.append('content', data.content);
    
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await axios.post(POST_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async (): Promise<Post[]> => {
    const response = await axios.get(GET_POSTS_URL);
    return response.data.posts;
  },

  getById: async (id: number): Promise<Post> => {
    const response = await axios.get(GET_POST_URL(id));
    return response.data.post;
  },

  update: async (id: number, data: UpdatePostData) => {
    const formData = new FormData();
    
    if (data.socialMediaId !== undefined) {
      formData.append('socialMediaId', data.socialMediaId.toString());
    }
    if (data.title !== undefined) {
      formData.append('title', data.title);
    }
    if (data.content !== undefined) {
      formData.append('content', data.content);
    }
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await axios.put(UPDATE_POST_URL(id), formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(DELETE_POST_URL(id));
    return response.data;
  }
};
