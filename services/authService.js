export const loginUser = async (credentials) => {
  const { $api } = useNuxtApp();
  
  try {
    const response = await $api.post('/login', credentials);
    return response.data;  // Return the response data for further processing
  } catch (error) {
    throw error.response.data.message || 'Login failed';
  }
};

export const registerUser = async (userData) => {
    const { $api } = useNuxtApp();
  
    try {
      const response = await $api.post('/register', userData); // Adjust the endpoint as necessary
      return response.data; // Return the response data for further processing
    } catch (error) {
      throw error.response.data.message || 'Registration failed';
    }
  };
  