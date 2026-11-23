
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import BusinessListingCard from "../../components/BusinessListings/BusinessListingCard";
import { getAllBusinessListings } from "../../api/businessListings.api";
import "./BusinessListings.css";

const categories = [
  "Dealership",
  "Insurance",
  "Leasing",
  "Workshop",
  "Importer",
  "Exporter",
  "Driving School",
  "Showroom",
];

function BusinessServicesHome() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        setError("");

        const results = await getAllBusinessListings();

        const allBusinesses = results.flatMap((result) =>
          (result.listings || []).map((business) => ({
            ...business,
            listing_category: result.category,
          }))
        );

        setBusinesses(allBusinesses);

        if (results.every((result) => result.error)) {
          setError("Unable to load business listings. Please check your APIs.");
        }
      } catch (err) {
        console.error("Business listings error:", err);
        setError("Unable to load business listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const cities = useMemo(() => {
    return [
      ...new Set(
        businesses
          .map((business) => business.city)
          .filter(Boolean)
      ),
    ].sort();
  }, [businesses]);

  const vehicleTypes = useMemo(() => {
    return [
      ...new Set(
        businesses
          .map(
            (business) =>
              business.vehicle_type || business.school_vehicle_type
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const name =
        business.business_name ||
        business.name ||
        business.school_name ||
        "";

      const searchText = [
        name,
        business.city,
        business.address,
        business.phone,
        business.web,
        business.listing_category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchText.includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" ||
        business.listing_category === selectedCategory;

      const matchesCity =
        selectedCity === "All" || business.city === selectedCity;

      const vehicleType =
        business.vehicle_type || business.school_vehicle_type;

      const matchesVehicle =
        selectedVehicle === "All" || vehicleType === selectedVehicle;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesCity &&
        matchesVehicle
      );
    });
  }, [
    businesses,
    search,
    selectedCategory,
    selectedCity,
    selectedVehicle,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedCity("All");
    setSelectedVehicle("All");
  };

  return (
    <>
      <Navbar />

      <main className="business-listing-page">
        <section className="business-listing-hero">
          <div className="business-listing-hero-content">
            <span className="business-listing-eyebrow">
              MOTORSCUBE BUSINESS NETWORK
            </span>

            <h1>Explore Automotive Businesses</h1>

            <p>
              Discover dealerships, insurance providers, leasing companies,
              workshops and other automotive businesses in one place.
            </p>
          </div>
        </section>

        <section className="business-listing-container">
          <div className="business-listing-heading">
            <div>
              <h2>All Business Listings</h2>
              <p>
                Find and connect with automotive businesses.
              </p>
            </div>

            <span className="business-listing-count">
              {filteredBusinesses.length} Businesses
            </span>
          </div>

          <div className="business-listing-filters">
            <div className="business-listing-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search business name, location or service..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">All Cities</option>

              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="All">All Vehicle </option>

              {vehicleTypes.map((vehicle) => (
                <option key={vehicle} value={vehicle}>
                  {vehicle}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="business-listing-clear"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          {loading ? (
            <div className="business-listing-message">
              Loading business listings...
            </div>
          ) : error && businesses.length === 0 ? (
            <div className="business-listing-message business-listing-error">
              {error}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="business-listing-message">
              <h3>No Businesses Found</h3>
              <p>
                No businesses match your search or selected filters.
                Try changing your filters.
              </p>
            </div>
          ) : (
            <>
              {error && (
                <div className="business-listing-message">
                  Some categories could not be loaded. Other available
                  listings are displayed below.
                </div>
              )}

              <div className="business-listing-grid">
                {filteredBusinesses.map((business, index) => (
                  <BusinessListingCard
                    key={`${business.listing_category}-${business.id || business.dealership_id || index}`}
                    business={business}
                    type={business.listing_category}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

export default BusinessServicesHome;
