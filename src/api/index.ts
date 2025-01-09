import axios from 'axios';
import { BACKEND_API_URL } from '../constants';

const api = axios.create({
  baseURL: BACKEND_API_URL, // Replace with your backend URL
});

export default api;
