
import api from "./axios";

// ======================================================
// GET ALL LISTINGS
// Uses the combined backend Listing API
// ======================================================

export const getAllListings = async ({
  listing_type = "sale",
  vehicle_type = "",
  search = "",
} = {}) => {
  const response = await api.get("/listings", {
    params: {
      listing_type,
      ...(vehicle_type && { vehicle_type }),
      ...(search && { search }),
    },
  });

  return response.data?.data ?? [];
};

// ======================================================
// GET SALE LISTINGS
// ======================================================

export const getSaleListings = async (vehicle_type = "") => {
  return getAllListings({
    listing_type: "sale",
    vehicle_type,
  });
};

// ======================================================
// GET HIRE LISTINGS
// ======================================================

export const getHireListings = async (vehicle_type = "") => {
  return getAllListings({
    listing_type: "hire",
    vehicle_type,
  });
};

// ======================================================
// GET SALE BY ID
// ======================================================

export const getSaleById = async (id) => {
  const response = await api.get(`/items-ad-sale/${id}`);
  return response.data;
};

// ======================================================
// GET HIRE BY ID
// ======================================================

export const getHireById = async (id) => {
  const response = await api.get(`/items-ad-hire/${id}`);
  return response.data;
};
