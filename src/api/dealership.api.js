import axios from "./axios";

export const createDealership = async (data) => {
  const response = await axios.post("/dealership", data);
  return response.data;
};

export const getDealerships = async () => {
  const response = await axios.get("/dealership");
  return response.data;
};

export const getDealershipById = async (id) => {
  const response = await axios.get(`/dealership/${id}`);
  return response.data;
};

export const updateDealership = async (id, data) => {
  const response = await axios.put(`/dealership/${id}`, data);
  return response.data;
};

export const deleteDealership = async (id) => {
  const response = await axios.delete(`/dealership/${id}`);
  return response.data;
};