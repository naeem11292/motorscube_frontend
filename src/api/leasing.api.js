
import api from "./axios";

export const createLeasing = async (data) => {
  const response = await api.post("/leasing", data);
  return response.data;
};

export const getLeasingListings = async () => {
  const response = await api.get("/leasing");
  return response.data;
};

export const getLeasingById = async (id) => {
  const response = await api.get(`/leasing/${id}`);
  return response.data;
};

export const updateLeasing = async (id, data) => {
  const response = await api.put(`/leasing/${id}`, data);
  return response.data;
};

export const deleteLeasing = async (id) => {
  const response = await api.delete(`/leasing/${id}`);
  return response.data;
};
