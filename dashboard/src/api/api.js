import axios from "axios";

const API = axios.create({
  baseURL: "https://finance-clone-4azm.onrender.com/api",
  // baseURL: "https://localhost:3002", 
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN SENT:", token); 

  if (token) {
    req.headers["Authorization"] = `Bearer ${token}`;
  }

  return req;
});

export default API;