
import api from "./axios";

// Create a new order
export const createOrder = async (data) => {
  const response = await api.post("/orders", data);
  return response.data;
};

// Get all orders
export const getAllOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// Get an order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

// Update an order
export const updateOrder = async (id, data) => {
  const response = await api.put(`/orders/${id}`, data);
  return response.data;
};

// Delete an order
export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};
