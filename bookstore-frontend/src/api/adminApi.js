import axiosClient from "./axiosClient";

// ---------- Dashboard ----------
export const getDashboard = () => axiosClient.get("/api/admin/dashboard");

// ---------- Books ----------
export const createBook = (payload) => axiosClient.post("/api/admin/books", payload);

export const updateBook = (bookId, payload) =>
  axiosClient.put(`/api/admin/books/${bookId}`, payload);

export const deleteBook = (bookId) => axiosClient.delete(`/api/admin/books/${bookId}`);

// ---------- Categories ----------
export const createCategory = (payload) => axiosClient.post("/api/admin/categories", payload);

export const updateCategory = (categoryId, payload) =>
  axiosClient.put(`/api/admin/categories/${categoryId}`, payload);

export const deleteCategory = (categoryId) =>
  axiosClient.delete(`/api/admin/categories/${categoryId}`);
// ---------- Orders ----------
export const getAdminOrders = (params) => axiosClient.get("/api/admin/orders", { params });

export const getAdminOrderById = (orderId) => axiosClient.get(`/api/admin/orders/${orderId}`);

export const updateOrderStatus = (orderId, status) =>
  axiosClient.put(`/api/admin/orders/${orderId}/status`, { status });

// ---------- Customers ----------
export const getCustomers = (params) => axiosClient.get("/api/admin/customers", { params });

// ---------- Sales ----------
// params example: { from: "2026-10-01", to: "2026-10-29" }
export const getDailySales = (params) => axiosClient.get("/api/admin/sales/daily", { params });

// params example: { limit: 5 }
export const getTopBooks = (params) => axiosClient.get("/api/admin/sales/top-books", { params });