import TokenManager from '../contexts/auth/supabase/tokenManager';

export const customFetch = async (url, options = {}) => {
    const token = TokenManager.getToken();

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
    };

    return await fetch(url, {
        ...options,
        headers,
    });
};
