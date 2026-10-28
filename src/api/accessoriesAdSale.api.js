import api from "./axios";

// Create an accessories sale advertisement
export const createAccessoriesAd = async (data) => {
  const response = await api.post("/accessories-ad-sale/", data);
  return response.data;
};