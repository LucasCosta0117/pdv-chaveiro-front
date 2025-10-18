import axios from "axios";

const apiUrl = process.env.VUE_APP_API_URL;

const api = axios.create({
  apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

export default api;