import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  
});

userRequest.interceptors.response.use(function (response) {
  if (response && response.data)
    return response.data;
}, (error) => {
  return Promise.reject(error);
});