import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.100.73:5000/api",
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default api;
