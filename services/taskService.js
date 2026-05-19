// services/taskService.js
export const addTask = async (taskData) => {
const { $api } = useNuxtApp(); 
  const tokenCookie = useCookie('auth_token'); 

  try {
    const response = await $api.post('/addTask', taskData, {
      headers: {
        // Passing token string via cookie contexts for request validation
        Authorization: `Bearer ${tokenCookie.value}` 
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Task creation failed';
  }
};
  
 export const updateTask = async (taskId, taskData) => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  try {
    const response = await $api.post(`/updateTask/${taskId}`, taskData, {
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Task update failed';
  }
};

export const getTasks = async () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  try {
    const response = await $api.get('/tasks', {
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    });
    return response.data.tasks;
  } catch (error) {
    throw error.response?.data?.message || 'Task retrieval failed';
  }
};

export const getTask = async (taskId) => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  try {
    const response = await $api.get(`/task/${taskId}`, {
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    });
    return response.data; 
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch task data';
  }
};

export const getUser = async () => {
  const { $api } = useNuxtApp();
  const tokenCookie = useCookie('auth_token');

  try {
    const response = await $api.get('/user', {
      headers: {
        Authorization: `Bearer ${tokenCookie.value}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'User retrieval failed';
  }
};