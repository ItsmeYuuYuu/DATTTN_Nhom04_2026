import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'https://diemdanhlophoc.onrender.com/api', // Port BE từ launchSettings.json
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Tự động kẹp Token vào mọi request gửi đi
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor: Xử lý response lỗi 401 (Token hết hạn) -> Tự động đá ra Login
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('stu_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosClient;
