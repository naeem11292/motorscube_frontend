
import axios from "./axios";

export const createCareerApplication = async (data) => {
  const response = await axios.post("/careers", data);
  return response.data;
};

export const getAllCareerApplications = async () => {
  const response = await axios.get("/careers");
  return response.data;
};

export const getCareerApplicationById = async (careerId) => {
  const response = await axios.get(`/careers/${careerId}`);
  return response.data;
};

export const updateCareerApplication = async (careerId, data) => {
  const response = await axios.patch(`/careers/${careerId}`, data);
  return response.data;
};

export const deleteCareerApplication = async (careerId) => {
  const response = await axios.delete(`/careers/${careerId}`);
  return response.data;
};
