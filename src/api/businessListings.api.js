
import api from "./axios";

// Other business APIs
import { getInsuranceListings } from "./insurance.api";
import { getLeasingListings } from "./leasing.api";
import { getWorkshopListings } from "./workshop.api";
import { getImporters, getExporters } from "./importExport.api";
import { getDrivingSchools } from "./drivingSchool.api";
import { getPublicShowroomListings } from "./showroom.api";
// Public dealership APIs
export const getPublicDealerships = async (params = {}) => {
  const response = await api.get("/dealership/public", { params });
  return response.data;
};

export const getPublicDealershipById = async (id) => {
  const response = await api.get(`/dealership/public/${id}`);
  return response.data;
};

// Extract listing arrays from API responses
const extractListings = (response) => {
  let result = response?.data ?? response;

  if (Array.isArray(result)) return result;

  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.listings)) return result.listings;
  if (Array.isArray(result?.results)) return result.results;

  return [];
};

// Fetch listings from all eight categories
export const getAllBusinessListings = async () => {
  const requests = [
    ["Dealership", getPublicDealerships],
    ["Insurance", getInsuranceListings],
    ["Leasing", getLeasingListings],
    ["Workshop", getWorkshopListings],
    ["Importer", getImporters],
    ["Exporter", getExporters],
    ["Driving School", getDrivingSchools],
    ["Showroom", getPublicShowroomListings],
  ];

  const results = await Promise.allSettled(
    requests.map(async ([category, fetchListings]) => {
      const response = await fetchListings();

      return {
        category,
        listings: extractListings(response),
      };
    })
  );

  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }

    console.error(
      `Failed to load ${requests[index][0]}:`,
      result.reason
    );

    return {
      category: requests[index][0],
      listings: [],
      error: true,
    };
  });
};
