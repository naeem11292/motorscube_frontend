
import api from "./axios";

const BASE_URL = "/accessories-ad-sale";

export const createAccessoriesAd = (data) =>
  api.post(`${BASE_URL}/`, data);

export const getAccessoriesAds = () =>
  api.get(`${BASE_URL}/`);

export const getAccessoriesAdById = (id) =>
  api.get(`${BASE_URL}/${id}`);

export const updateAccessoriesAd = (id, data) =>
  api.put(`${BASE_URL}/${id}`, data);

export const deleteAccessoriesAd = (id) =>
  api.delete(`${BASE_URL}/${id}`);
