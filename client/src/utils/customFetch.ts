import axios from 'axios';

const customFetch = axios.create({
    baseURL: '/api',
    withCredentials: true
});

export default customFetch;