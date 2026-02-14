import { getCurrentUser } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_GATEWAY_URL;

/**
 * Get the current user's ID token for API requests
 */
const getIdToken = async () => {
  const user = await getCurrentUser();
  return user.session.getIdToken().getJwtToken();
};

/**
 * Upload profile data to S3 via API Gateway
 * @param {Object} profileData - The user profile data
 * @returns {Promise} - Upload result
 */
export const saveProfile = async (profileData) => {
  try {
    const idToken = await getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken,
      },
      body: JSON.stringify({ profileData }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to save profile');
    }

    return data;
  } catch (error) {
    console.error('Profile save error:', error);
    throw error;
  }
};

/**
 * Placeholder for future: Get user's profile data
 */
export const getProfile = async () => {
  // TODO: Implement after creating Lambda to retrieve S3 object
  return null;
};
