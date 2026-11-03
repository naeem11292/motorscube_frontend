
import api from "./axios";

// Create an accessories sale advertisement
export const createAccessoriesAd = async (data) => {
  const response = await api.post("/accessories-ad-sale/", data);
  return response.data;
};

// Get all accessories sale advertisements
export const getAllAccessoriesAds = async () => {
  const response = await api.get("/accessories-ad-sale/");
  return response.data;
};

// Get one accessories advertisement
export const getAccessoriesAdById = async (id) => {
  const response = await api.get(`/accessories-ad-sale/${id}`);
  return response.data;
};

// Delete an accessories advertisement
export const deleteAccessoriesAd = async (id) => {
  const response = await api.delete(`/accessories-ad-sale/${id}`);
  return response.data;
};
export const updateAccessoriesAd = async (id, data) => {
  const response = await api.put(`/accessories-ad-sale/${id}`, data);
  return response.data;
};