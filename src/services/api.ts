import axios from 'axios';

const API_URL = 'http://localhost:8081/oceanviewresort/api';

const api = axios.create({
    baseURL: API_URL,   
});

export default api;