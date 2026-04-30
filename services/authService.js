export const loginUser = async (credentials) => {
  const { $api } = useNuxtApp();
  const router = useRouter();
  
  // Initialize Cookies
  const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7, path: '/' });
  const userCookie = useCookie('user', { maxAge: 60 * 60 * 24 * 7, path: '/' });

  try {
    const response = await $api.post('/login', credentials);

    const token = response.data.access_token;
    const userData = {
      user_type: response.data.user_type,
      first_name: response.data.first_name,
      last_name: response.data.last_name,
      position: response.data.position,
      id: response.data.id || response.data.user_id // Siguraduhin nating may ID para sa notifications
    };

    // 1. Store in Cookies (Para sa Middleware/SSR)
    tokenCookie.value = token;
    userCookie.value = JSON.stringify(userData);

    // 2. Store in LocalStorage (Back-up/Existing Logic)
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));

    // 3. Redirect
    return navigateTo(response.data.redirect_to || '/employee');
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};

export const logoutUser = async () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');
  const userCookie = useCookie('user');

  try {
    await $api.post('/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // 1. Clear Cookies
    tokenCookie.value = null;
    userCookie.value = null;

    // 2. Clear LocalStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('timeIn');

    // 3. Redirect to login
    return navigateTo('/');
  }
};

export const timeoutUser = async (credentials) => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');
  const userCookie = useCookie('user');

  try {
    const response = await $api.post('/timeout', {
      email: credentials.email,
      password: credentials.password,
    });

    console.log('Timeout successful:', response.data.message);

    // 🔥 CLEAR EVERYTHING ON TIMEOUT
    tokenCookie.value = null;
    userCookie.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');

    // 🔥 REDIRECT TO LOGIN
    return navigateTo('/'); 
  } catch (error) {
    console.error('Timeout failed:', error.response?.data?.message || error.message);
    throw error;
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

  export const uploadLoginPhoto = async (photo) => {
    const { $api } = useNuxtApp(); // Use the API instance from Nuxt
  
    const formData = new FormData();
    formData.append('photo', photo); // Append the photo to the form data
  
    try {
      const response = await $api.post('/login-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the header is set correctly
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`, // Include the auth token if required
        },
      });
  
      console.log('Photo upload successful:', response.data);
      return response.data; // Return the server response
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Photo upload failed';
      console.error('Photo upload failed:', message);
      throw new Error(message);
    }
  };

  
  
  
  
  