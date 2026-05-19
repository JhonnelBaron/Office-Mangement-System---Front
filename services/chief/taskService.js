export const getTasks = async () => {
    const { $api } = useNuxtApp();
    const token = useCookie('auth_token');
  
    try {
      const response = await $api.get('/userTasks', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      return response.data.tasks;
    } catch (error) {
      throw error.response?.data?.message || 'Task retrieval failed';
    }
  };

  export const getTasksCount = async () => {
    const { $api } = useNuxtApp();
    const token = useCookie('auth_token');

    try {
      const response = await $api.get('/tasks-count', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Task retrieval failed';
    }
  };