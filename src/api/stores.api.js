
import api from "./axios";

export const createStore = (formData) => {
  return api.post("/store", formData);
};

export const getStores = () => {
  return api.get("/store");
};

export const getStoreById = (id) => {
  return api.get(`/store/${id}`);
};

export const updateStore = (id, formData) => {
  return api.put(`/store/${id}`, formData);
};

export const deleteStore = (id) => {
  return api.delete(`/store/${id}`);
};
