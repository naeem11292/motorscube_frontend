import api from "axios";
export const createWorkshop = async (data) => {
  const response = await api.post("/workshop", data);
  return response.data;
};

export const getWorkshopListings = async () => {
  const response = await api.get("/workshop");
  return response.data;
};

export const getWorkshopById = async (id) => {
  const response = await api.get(`/workshop/${id}`);
  return response.data;
};

export const updateWorkshop = async (id, data) => {
  const response = await api.put(`/workshop/${id}`, data);
  return response.data;
};

export const deleteWorkshop = async (id) => {
  const response = await api.delete(`/workshop/${id}`);
  return response.data;
};