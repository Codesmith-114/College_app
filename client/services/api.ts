import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle responses
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (portalId: string, password: string) =>
        apiClient.post('/auth/login', { portalId, password }),

    signup: (data: any) =>
        apiClient.post('/auth/signup', data),

    verify: () =>
        apiClient.get('/auth/verify')
};

export const dashboardAPI = {
    getDashboardData: (userId: string) =>
        apiClient.get(`/dashboard/data?userId=${userId}`),

    getAttendanceDetails: (subjectId: string) =>
        apiClient.get(`/dashboard/attendance/${subjectId}`),

    getTasks: (status?: string, type?: string) => {
        let url = '/dashboard/tasks';
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (type) params.append('type', type);
        return apiClient.get(`${url}${params.toString() ? '?' + params : ''}`);
    }
};

export default apiClient;
