import api from "./axios";

export const createSaleAd = async (data) => {
  const response = await api.post("/items-ad-sale/", data);

  return response.data;
};