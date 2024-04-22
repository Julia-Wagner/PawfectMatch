import axios from "axios";

axios.defaults.baseURL = "https://pawfect-api-dacc0c5bf00c.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();