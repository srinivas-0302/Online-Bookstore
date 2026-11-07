import axiosClient from "./axiosClient";

export const placeOrderRequest = (payload) => axiosClient.post("/api/orders", payload);

// params example: { page: 0, size: 5, sortBy: "orderDate", direction: "desc" }
export const getMyOrders = (params) => axiosClient.get("/api/orders", { params });

export const getMyOrderById = (orderId) => axiosClient.get(`/api/orders/${orderId}`);