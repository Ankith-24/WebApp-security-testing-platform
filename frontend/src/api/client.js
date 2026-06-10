import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const api = {
  scan: async (target) => {
    const response = await client.post('/scan', { target });
    return response.data;
  },
  getReports: async () => {
    const response = await client.get('/reports');
    return response.data;
  },
  getReport: async (filename) => {
    const response = await client.get(`/report/${filename}`);
    return response.data;
  }
};
