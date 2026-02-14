import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

/**
 * Sign up a new user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's name
 * @returns {Promise} - Resolves with user data including username
 */
export const signUp = (email, password, name) => {
  return new Promise((resolve, reject) => {
    // Generate a unique username (UUID-like)
    const username = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    
    const attributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      }),
      new CognitoUserAttribute({
        Name: 'name',
        Value: name,
      }),
    ];

    userPool.signUp(username, password, attributeList, null, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      // Return both result and username for confirmation
      resolve({ ...result, username });
    });
  });
};

/**
 * Verify email with confirmation code
 * @param {string} username - User's username (from signup)
 * @param {string} code - Verification code from email
 * @returns {Promise}
 */
export const confirmSignUp = (username, code) => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: username,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};

/**
 * Sign in a user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} - Resolves with session data
 */
export const signIn = (email, password) => {
  return new Promise((resolve, reject) => {
    const authenticationData = {
      Username: email,
      Password: password,
    };

    const authenticationDetails = new AuthenticationDetails(authenticationData);

    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * Sign out the current user
 */
export const signOut = () => {
  const cognitoUser = userPool.getCurrentUser();
  if (cognitoUser) {
    cognitoUser.signOut();
  }
};

/**
 * Get current authenticated user
 * @returns {Promise} - Resolves with user session
 */
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();

    if (!cognitoUser) {
      reject(new Error('No user found'));
      return;
    }

    cognitoUser.getSession((err, session) => {
      if (err) {
        reject(err);
        return;
      }

      if (!session.isValid()) {
        reject(new Error('Session is invalid'));
        return;
      }

      cognitoUser.getUserAttributes((err, attributes) => {
        if (err) {
          reject(err);
          return;
        }

        const userData = {};
        attributes.forEach((attribute) => {
          userData[attribute.Name] = attribute.Value;
        });

        resolve({
          ...userData,
          session,
          username: cognitoUser.getUsername(),
        });
      });
    });
  });
};

/**
 * Forgot password - send verification code
 * @param {string} email - User's email
 * @returns {Promise}
 */
export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (data) => {
        resolve(data);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * Reset password with verification code
 * @param {string} email - User's email
 * @param {string} code - Verification code
 * @param {string} newPassword - New password
 * @returns {Promise}
 */
export const resetPassword = (email, code, newPassword) => {
  return new Promise((resolve, reject) => {
    const userData = {
      Username: email,
      Pool: userPool,
    };

    const cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => {
        resolve('Password reset successful');
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};
