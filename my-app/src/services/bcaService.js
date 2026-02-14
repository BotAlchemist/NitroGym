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
 * Upload BCA data to S3 via API Gateway
 * @param {string} bcaData - The BCA report text
 * @returns {Promise} - Upload result
 */
export const uploadBCAData = async (bcaData) => {
  try {
    const idToken = await getIdToken();
    
    const response = await fetch(`${API_BASE_URL}/bca`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': idToken,
      },
      body: JSON.stringify({ bcaData }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload BCA data');
    }

    return data;
  } catch (error) {
    console.error('BCA upload error:', error);
    throw error;
  }
};

/**
 * Placeholder for future: Get user's BCA history
 */
export const getBCAHistory = async () => {
  // TODO: Implement after creating Lambda to list S3 objects
  return [];
};
