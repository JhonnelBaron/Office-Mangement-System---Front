export const loginUser = async (credentials) => {
  const { $api } = useNuxtApp();
  
  // Initialize Cookies with appropriate session parameters
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
      id: response.data.id || response.data.user_id // Verification identity context for notifications
    };

    // Commit authentication payload strictly to Cookie parameters for seamless SSR validation
    tokenCookie.value = token;
    userCookie.value = JSON.stringify(userData);

    // Route implementation based on direct response destination properties
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
  const timeInCookie = useCookie('timeIn');

  try {
    await $api.post('/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // 1. Clear Cookies to completely scrub authentication states
    tokenCookie.value = null;
    userCookie.value = null;
    timeInCookie.value = null;

    // 2. Redirect securely to the entry route
    return navigateTo('/');
  }
};

export const timeoutUser = async (credentials) => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');
  const userCookie = useCookie('user');
  const timeInCookie = useCookie('timeIn');

  try {
    const response = await $api.post('/timeout', {
      email: credentials.email,
      password: credentials.password,
    });

    console.log('Timeout successful:', response.data.message);

    // Clear session context via cookies upon confirmation
    tokenCookie.value = null;
    userCookie.value = null;
    timeInCookie.value = null;

    return navigateTo('/'); 
  } catch (error) {
    console.error('Timeout failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  const { $api } = useNuxtApp();

  try {
    const response = await $api.post('/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Registration failed';
  }
};

export const uploadLoginPhoto = async (photo) => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  const formData = new FormData();
  formData.append('photo', photo);

  try {
    const response = await $api.post('/login-photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // Injecting the bearer token straight from cookies for SSR compatibility
        Authorization: `Bearer ${tokenCookie.value}`,
      },
    });

    console.log('Photo upload successful:', response.data);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Photo upload failed';
    console.error('Photo upload failed:', message);
    throw new Error(message);
  }
};

  
  
  
  
  