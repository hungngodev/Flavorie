import axios from 'axios';

const customFetch = axios.create({
    baseURL: '/api',
});

export default customFetch;