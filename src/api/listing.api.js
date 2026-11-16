
import api from "./axios";

// Fetch Sale listings, optionally filtered by vehicle category
export const getSaleListings = async (vehicle_type = "") => {
  const response = await api.get("/items-ad-sale/", {
    params: vehicle_type ? { vehicle_type } : {},
  });

  return response.data?.data ?? [];
};

// Fetch Hire listings, optionally filtered by vehicle category
export const getHireListings = async (vehicle_type = "") => {
  const response = await api.get("/items-ad-hire/", {
    params: vehicle_type ? { vehicle_type } : {},
  });

  return response.data?.data ?? [];
};

// Fetch listings according to the selected Sale/Hire type and category
export const getAllListings = async ({
  listing_type = "",
  vehicle_type = "",
} = {}) => {
  let sales = [];
  let hires = [];

  if (listing_type === "sale") {
    sales = await getSaleListings(vehicle_type);
  } else if (listing_type === "hire") {
    hires = await getHireListings(vehicle_type);
  } else {
    const [saleResult, hireResult] = await Promise.allSettled([
      getSaleListings(vehicle_type),
      getHireListings(vehicle_type),
    ]);

    if (
      saleResult.status === "rejected" &&
      hireResult.status === "rejected"
    ) {
      throw new Error("Unable to load vehicle listings.");
    }

    sales =
      saleResult.status === "fulfilled" ? saleResult.value : [];

    hires =
      hireResult.status === "fulfilled" ? hireResult.value : [];
  }

  const normalizedSales = (Array.isArray(sales) ? sales : []).map(
    (item) => ({
      ...item,
      listing_id: item.sale_id,
      listing_type: "sale",
      display_price: item.price,
    })
  );

  const normalizedHires = (Array.isArray(hires) ? hires : []).map(
    (item) => ({
      ...item,
      listing_id: item.hire_id,
      listing_type: "hire",
      display_price: item.charges,
    })
  );

  return [...normalizedSales, ...normalizedHires].sort(
    (a, b) =>
      new Date(b.post_created_date || 0).getTime() -
      new Date(a.post_created_date || 0).getTime()
  );
};

// Get one sale listing by ID
export const getSaleById = async (id) => {
  const response = await api.get(`/items-ad-sale/${id}`);
  return response.data;
};

// Get one hire listing by ID
export const getHireById = async (id) => {
  const response = await api.get(`/items-ad-hire/${id}`);
  return response.data;
};
