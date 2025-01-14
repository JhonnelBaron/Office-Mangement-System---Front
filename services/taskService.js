// services/taskService.js
export const addTask = async (taskData) => {
    const { $api } = useNuxtApp(); // Use the Nuxt app instance to access $api
    const token = localStorage.getItem('auth_token'); // Retrieve token from localStorage
  
    try {
      const response = await $api.post('/addTask', taskData, {
        headers: {
          Authorization: `Bearer ${token}` // Pass token for authorization
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Task creation failed';
    }
  };
  
  export const updateTask = async (taskId, taskData) => {
    const { $api } = useNuxtApp();
    const token = localStorage.getItem('auth_token');
  
    try {
      const response = await $api.post(`/updateTask/${taskId}`, taskData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Task update failed';
    }
  };
  
  export const getTasks = async () => {
    const { $api } = useNuxtApp();
    const token = localStorage.getItem('auth_token');
  
    try {
      const response = await $api.get('/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data.tasks;
    } catch (error) {
      throw error.response?.data?.message || 'Task retrieval failed';
    }
  };
  
  export const getTask = async (taskId) => {
  const { $api } = useNuxtApp();
  const token = localStorage.getItem('auth_token');

  try {
    const response = await $api.get(`/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Return task data
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch task data';
  }
};

export const getUser = async () => {
  const { $api } = useNuxtApp();
  const token = localStorage.getItem('auth_token');

  try {
    const response = await $api.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'User retrieval failed';
  }
};
