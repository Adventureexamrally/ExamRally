import axios from 'axios';

const Api = axios.create({
    baseURL: import.meta.env.VITE_APP_API_BASE_URL,  // Using the env variable
    headers: {
        'Authorization': `Bearer YOUR_API_TOKEN`
    }
});

export default Api;
