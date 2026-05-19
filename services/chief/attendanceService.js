export const getAttendance = async () => {
    const { $api } = useNuxtApp();
    const token = useCookie('auth_token');
  
    try {
      const response = await $api.get('/attendance', {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      });
      return response.data.attendance;
    } catch (error) {
      throw error.response?.data?.message || 'Attendance retrieval failed';
    }
  };

export const getEmployees = async () => {
    const { $api } = useNuxtApp();
    const token = useCookie('auth_token');

    try{
        const response = await $api.get('/employees', {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });
        return response.data.employees;
    } catch (error) {
        throw error.response?.data?.message || 'Employees retrieval failed';
    }
};