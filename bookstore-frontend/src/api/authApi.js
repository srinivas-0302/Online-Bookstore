import axiosClient from "./axiosClient";

export const loginRequest = (credentials) =>
  axiosClient.post("/api/auth/login", credentials);

export const registerRequest = (data) =>
  axiosClient.post("/api/auth/register", data);