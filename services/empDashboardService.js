export const getTasks = async () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  try {
    const response = await $api.get('/dashboard/tasks', {
      headers: {
        // Utilizing the persistent cookie instance for request validation
        Authorization: `Bearer ${tokenCookie.value}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Task retrieval failed';
  }
};

export const getUserAttendance = async () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  try {
    const response = await $api.get('/dashboard/attendance', {
      headers: {
        // Implementing cookie state value execution for authentication headers
        Authorization: `Bearer ${tokenCookie.value}`
      }
    });
    return response.data.LogInfo;
  } catch (error) {
    throw error.response?.data?.message || 'Attendance retrieval failed';
  }
};