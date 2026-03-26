import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
});

export const loginUser = (data) => API.post("/login", data);
export const signupUser = (data) => API.post("/signup", data);
export const saveProfile = (id, data) =>
  API.post(`/profile/${id}`, data);
export const getCandidates = () => API.get("/candidates");

export const shortlistUser = (data) =>
  API.post("/shortlist", data);

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = token;
  return req;
});