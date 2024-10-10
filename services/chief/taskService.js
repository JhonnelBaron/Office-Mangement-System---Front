export const getTasks = async () => {
    const { $api } = useNuxtApp();
    const token = localStorage.getItem('auth_token');
  
    try {
      const response = await $api.get('/userTasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.tasks;
    } catch (error) {
      throw error.response?.data?.message || 'Task retrieval failed';
    }
  };