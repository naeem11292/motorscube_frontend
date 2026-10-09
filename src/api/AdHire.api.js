import api from "./axios";

export const createHireAd = async (data) => {
  const response = await api.post("/items-ad-hire/", data);

  return response.data;
};

export const getAllHireAds = async () => {
  const response = await api.get("/items-ad-hire/");

  return response.data;
};

export const getHireAdById = async (hireId) => {
  const response = await api.get(`/items-ad-hire/${hireId}`);

  return response.data;
};

export const updateHireAd = async (hireId, data) => {
  const response = await api.put(`/items-ad-hire/${hireId}`, data);

  return response.data;
};

export const deleteHireAd = async (hireId) => {
  const response = await api.delete(`/items-ad-hire/${hireId}`);

  return response.data;
};