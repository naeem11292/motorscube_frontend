
import api from "./axios";

// ==================== SHOWROOM ====================

// Create showroom
export const createShowroom = async (data) => {
  const response = await api.post("/showroom", data);
  return response.data;
};

// Get all showroom listings
export const getShowroomListings = async () => {
  const response = await api.get("/showroom");
  return response.data;
};

// Get showroom by ID
export const getShowroomById = async (id) => {
  const response = await api.get(`/showroom/${id}`);
  return response.data;
};

// Update showroom
export const updateShowroom = async (id, data) => {
  const response = await api.put(`/showroom/${id}`, data);
  return response.data;
};

// Delete showroom
export const deleteShowroom = async (id) => {
  const response = await api.delete(`/showroom/${id}`);
  return response.data;
};
