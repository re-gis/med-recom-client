import axios from 'axios';

const api = axios.create({
  baseURL: "https://med-recom-api.onrender.com/api/v1", // Replace with your backend URL
});

export default api;
