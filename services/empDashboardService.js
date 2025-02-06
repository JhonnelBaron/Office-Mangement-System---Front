export const getTasks = async () => {
    const { $api } = useNuxtApp();
    const token = localStorage.getItem('auth_token');
  
    try {
      const response = await $api.get('/dashboard/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Task retrieval failed';
    }
  };

  export const getUserAttendance = async () => {
    const { $api } = useNuxtApp();
    const token = localStorage.getItem('auth_token');
  
    try {
      const response = await $api.get('/dashboard/attendance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.LogInfo;
    } catch (error) {
      throw error.response?.data?.message || 'Attendance retrieval failed';
    }
  };

