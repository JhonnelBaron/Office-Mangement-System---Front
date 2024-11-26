// export const loginUser = async (credentials) => {
//   const { $api } = useNuxtApp(); 
//   const router = useRouter();

//   try {
//     const response = await $api.post('/login', credentials);

//     const token = response.data.data.access_token;
//     const user = response.data.data.user;
//     const redirectUrl = response.data.data.redirect_url;

//     localStorage.setItem('auth_token', token);
//     localStorage.setItem('user', JSON.stringify(user));

//     router.push(redirectUrl);

//   } catch (error) {
//     const message = error.response?.data?.message || error.message || 'Login failed';
//     console.error('Login failed:', message);
//     throw new Error(message); 
//   }
// };
export const loginUser = async (credentials) => {
  const { $api } = useNuxtApp(); 
  const router = useRouter();  // Use Vue router instance
  
  try {
    const response = await $api.post('/login', credentials);

    const token = response.data.access_token;  // Access token
    const user = {
      user_type: response.data.user_type,   // Store user_type as part of user object
      time_in: response.data.time_in,       // Store any other necessary fields (like time_in)
      first_name: response.data.first_name,
      last_name: response.data.last_name,
      position: response.data.position,
    };
    const redirectUrl = response.data.redirect_to;  // Redirect URL after login

    // Store token and user data in localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(user));  // Ensure full user object is stored

    console.log('Stored user:', JSON.parse(localStorage.getItem('user')));

    // Use Vue Router for redirection instead of window.location.href
    router.push(redirectUrl);  
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
  
  