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

  export const getTasksCount = async () => {
    const { $api } = useNuxtApp();
    const token = localStorage.getItem('auth_token');
  
    try {
      const response = await $api.get('/tasks-count', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Task retrieval failed';
    }
  };