
import api from "./axios";

// Create an insurance listing
export const createInsurance = async (data) => {
  const response = await api.post("/insurance", data);
  return response.data;
};

// Get all insurance listings
export const getInsuranceListings = async () => {
  const response = await api.get("/insurance");
  return response.data;
};

// Get an insurance listing by ID
export const getInsuranceById = async (id) => {
  const response = await api.get(`/insurance/${id}`);
  return response.data;
};

// Update an insurance listing
export const updateInsurance = async (id, data) => {
  const response = await api.put(`/insurance/${id}`, data);
  return response.data;
};

// Delete an insurance listing
export const deleteInsurance = async (id) => {
  const response = await api.delete(`/insurance/${id}`);
  return response.data;
};
