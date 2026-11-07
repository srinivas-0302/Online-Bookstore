import axiosClient from "./axiosClient";

export const getProfile = () => axiosClient.get("/api/profile");

export const updateProfile = (payload) => axiosClient.put("/api/profile", payload);

export const changePasswordRequest = (payload) =>
  axiosClient.put("/api/profile/password", payload);