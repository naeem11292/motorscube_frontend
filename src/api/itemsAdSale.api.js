
import api from "./axios";

// Create a sale advertisement
export const createSaleAd = async (data) => {
  const response = await api.post("/items-ad-sale/", data);
  return response.data;
};

// Get all sale advertisements
export const getAllSaleAds = async () => {
  const response = await api.get("/items-ad-sale/");
  return response.data;
};

// Get a sale advertisement by ID
export const getSaleAdById = async (saleId) => {
  const response = await api.get(`/items-ad-sale/${saleId}`);
  return response.data;
};

// Update a sale advertisement
export const updateSaleAd = async (saleId, data) => {
  const response = await api.put(`/items-ad-sale/${saleId}`, data);
  return response.data;
};

// Delete a sale advertisement
export const deleteSaleAd = async (saleId) => {
  const response = await api.delete(`/items-ad-sale/${saleId}`);
  return response.data;
};
