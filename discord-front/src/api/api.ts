import axios from 'axios';

const api = axios.create({
  baseURL: 'https://proyectoconnodeyexpress-production.up.railway.app',
});

export default api;
