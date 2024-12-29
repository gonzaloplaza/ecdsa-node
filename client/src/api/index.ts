import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3042',
});

export default api;
