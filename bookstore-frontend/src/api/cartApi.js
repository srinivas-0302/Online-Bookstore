import axiosClient from "./axiosClient";

export const getCart = () => axiosClient.get("/api/cart");

export const addCartItem = (payload) => axiosClient.post("/api/cart/items", payload);

export const updateCartItem = (cartItemId, payload) =>
  axiosClient.put(`/api/cart/items/${cartItemId}`, payload);

export const removeCartItem = (cartItemId) =>
  axiosClient.delete(`/api/cart/items/${cartItemId}`);

export const clearCartRequest = () => axiosClient.delete("/api/cart");