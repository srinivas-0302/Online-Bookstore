import axiosClient from "./axiosClient";

// params example: { page: 0, size: 6, keyword: "java" } -> ?page=0&size=6&keyword=java
export const getBooks = (params) => axiosClient.get("/api/books", { params });

export const getBookById = (id) => axiosClient.get(`/api/books/${id}`);