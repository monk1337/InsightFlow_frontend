import axios from 'axios';

const axiosClient = axios.create();

axiosClient.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axiosClient.defaults.withCredentials = true;

export default axiosClient;
