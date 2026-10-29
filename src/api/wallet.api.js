
import axios from "./axios";

// Get the logged-in user's wallet balance
export const getWalletBalance = async () => {
  const response = await axios.get("/wallet");
  return response.data;
};

// Get the logged-in user's wallet transactions
export const getWalletTransactions = async () => {
  const response = await axios.get("/wallet/transactions");
  return response.data;
};

// Request to add funds to the wallet
export const addWalletFunds = async (data) => {
  const response = await axios.post("/wallet/add-funds", data);
  return response.data;
};
