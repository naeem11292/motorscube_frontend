import api from "./axios";

// Create Importer
export const createImporter = async (formData) => {
  const response = await api.post("/importer", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Get all Importers
export const getImporters = async () => {
  const response = await api.get("/importer");
  return response.data;
};

// Get Importer by ID
export const getImporterById = async (id) => {
  const response = await api.get(`/importer/${id}`);
  return response.data;
};

// Update Importer
export const updateImporter = async (id, formData) => {
  const response = await api.put(`/importer/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Delete Importer
export const deleteImporter = async (id) => {
  const response = await api.delete(`/importer/${id}`);
  return response.data;
};