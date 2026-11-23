
import api from "./axios";

// ==================== DRIVING SCHOOL ====================

// Create driving school
export const createDrivingSchool = async (data) => {
  const response = await api.post("/driving-school", data);
  return response.data;
};

// Get all driving schools
export const getDrivingSchools = async () => {
  const response = await api.get("/driving-school");
  return response.data;
};

// Get driving school by ID
export const getDrivingSchoolById = async (id) => {
  const response = await api.get(`/driving-school/${id}`);
  return response.data;
};

// Update driving school
export const updateDrivingSchool = async (id, data) => {
  const response = await api.put(`/driving-school/${id}`, data);
  return response.data;
};

// Delete driving school
export const deleteDrivingSchool = async (id) => {
  const response = await api.delete(`/driving-school/${id}`);
  return response.data;
};
