
import api from "./axios";

export const getSaleListings = async () => {
  const response = await api.get("/items-ad-sale/");
  return response.data?.data ?? [];
};

export const getHireListings = async () => {
  const response = await api.get("/items-ad-hire/");
  return response.data?.data ?? [];
};

export const getAllListings = async () => {
  const [saleResult, hireResult] = await Promise.allSettled([
    getSaleListings(),
    getHireListings(),
  ]);

  if (
    saleResult.status === "rejected" &&
    hireResult.status === "rejected"
  ) {
    throw new Error("Unable to load vehicle listings.");
  }

  const sales =
    saleResult.status === "fulfilled" ? saleResult.value : [];

  const hires =
    hireResult.status === "fulfilled" ? hireResult.value : [];

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
