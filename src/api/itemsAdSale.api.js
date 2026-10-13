
import api from "./axios";

// Create sale advertisement with vehicle details and images
export const createSaleAd = async (data) => {
  const response = await api.post("/items-ad-sale/", data);

  return response.data;
};
