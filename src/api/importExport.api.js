import api from "./axios";

// ==================== IMPORTER ====================

export const createImporter = async (formData) => {
  const response = await api.post("/importer", formData);
  return response.data;
};

export const getImporters = async () => {
  const response = await api.get("/importer");
  return response.data;
};

export const getImporterById = async (id) => {
  const response = await api.get(`/importer/${id}`);
  return response.data;
};

export const updateImporter = async (id, formData) => {
  const response = await api.put(`/importer/${id}`, formData);
  return response.data;
};

export const deleteImporter = async (id) => {
  const response = await api.delete(`/importer/${id}`);
  return response.data;
};

// ==================== EXPORTER ====================

export const createExporter = async (formData) => {
  const response = await api.post("/exporter", formData);
  return response.data;
};

export const getExporters = async () => {
  const response = await api.get("/exporter");
  return response.data;
};

export const getExporterById = async (id) => {
  const response = await api.get(`/exporter/${id}`);
  return response.data;
};

export const updateExporter = async (id, formData) => {
  const response = await api.put(`/exporter/${id}`, formData);
  return response.data;
};

export const deleteExporter = async (id) => {
  const response = await api.delete(`/exporter/${id}`);
  return response.data;
};