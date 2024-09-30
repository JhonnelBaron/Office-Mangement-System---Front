// export const loginUser = async (credentials) => {
//   const { $api } = useNuxtApp();
  
//   try {
//     const response = await $api.post('/login', credentials);
//     return response.data;  // Return the response data for further processing
//   } catch (error) {
//     throw error.response.data.message || 'Login failed';
//   }
// };

export const loginUser = async (credentials) => {
  const { $api } = useNuxtApp(); 
  
  try {
    const response = await $api.post('/login', credentials);

    const token = response.data.data.access_token;
    const user = response.data.data.user;
    const redirectUrl = response.data.data.redirect_url;

    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));

    window.location.href = redirectUrl;

  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Login failed';
    console.error('Login failed:', message);
    throw new Error(message); 
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

  export const logoutUser = async () => {
    const { $api } = useNuxtApp();
  
    try {
      await $api.post('/logout'); // Call the logout endpoint
  
      // Clear the token and user data from localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
  
      // Optionally, redirect to the login page or homepage
      window.location.href = '/'; // Adjust this according to your routing
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  