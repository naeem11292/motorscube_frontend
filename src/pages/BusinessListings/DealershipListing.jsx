
import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import BusinessListingCard from "../../components/BusinessListings/BusinessListingCard";
import { getPublicDealerships } from "../../api/businessListings.api";
import "./BusinessListings.css";

const IMAGE_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${IMAGE_BASE_URL}/${image.replace(/\\/g, "/").replace(/^\/+/, "")}`;
}

function DealershipListing() {
  const [dealerships, setDealerships] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDealerships = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getPublicDealerships();

        const listings = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        setDealerships(listings);
      } catch (err) {
        console.error("Failed to fetch dealerships:", err);
        setError(
          err.response?.data?.message || "Unable to load dealerships."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDealerships();
  }, []);

  const cities = useMemo(() => {
    return [
      ...new Set(
        dealerships
          .map((item) => item.city)
          .filter(Boolean)
          .map((value) => value.trim())
      ),
    ].sort();
  }, [dealerships]);

  const filteredDealerships = useMemo(() => {
    return dealerships.filter((dealership) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        [
          dealership.business_name,
          dealership.city,
          dealership.address,
          dealership.dealership_deals_in,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(searchText));

      const matchesCity =
        !city || dealership.city?.toLowerCase() === city.toLowerCase();

      const matchesVehicleType =
        !vehicleType || dealership.vehicle_type === vehicleType;

      return matchesSearch && matchesCity && matchesVehicleType;
    });
  }, [dealerships, search, city, vehicleType]);

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setVehicleType("");
  };

  return (
    <>
      <Navbar />

      <main className="business-listing-page">
        <section className="business-listing-hero">
          <div className="business-listing-hero-content">
            <span className="business-listing-eyebrow">
              MOTORSCUBE BUSINESS DIRECTORY
            </span>

            <h1>Find Your Trusted Dealership</h1>

            <p>
              Explore dealerships, discover vehicles, and connect with
              automotive businesses across Pakistan.
            </p>
          </div>
        </section>

        <section className="business-listing-container">
          <div className="business-listing-heading">
            <div>
              <h2>Car & Vehicle Dealerships</h2>
              <p>
                Find dealerships that match your needs.
              </p>
            </div>

            <span className="business-listing-count">
              {filteredDealerships.length} Dealerships
            </span>
          </div>

          <div className="business-listing-filters">
            <div className="business-listing-search">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search dealership, city or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All Cities</option>

              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="">All Vehicle Types</option>
              <option value="car">Cars</option>
              <option value="bike">Bikes</option>
              <option value="commercial">Commercial</option>
              <option value="machinery">Machinery</option>
              <option value="plant">Plant</option>
            </select>

            <button
              type="button"
              className="business-listing-clear"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>

          {loading && (
            <div className="business-listing-message">
              Loading dealerships...
            </div>
          )}

          {!loading && error && (
            <div className="business-listing-message business-listing-error">
              {error}
            </div>
          )}

          {!loading && !error && filteredDealerships.length === 0 && (
            <div className="business-listing-message">
              <h3>No dealerships found</h3>
              <p>Try changing your search or filters.</p>
            </div>
          )}

          {!loading && !error && filteredDealerships.length > 0 && (
            <div className="business-listing-grid">
                
              {filteredDealerships.map((dealership) => {
                const image =
                  dealership.dealership_img1 ||
                  dealership.dealership_img2 ||
                  dealership.dealership_img3;

                return (
                  <article
                    className="business-dealership-card"
                    key={dealership.id}
                  >
                    <div className="business-dealership-image">
                      {image ? (
                        <img
                          src={getImageUrl(image)}
                          alt={dealership.business_name}
                          loading="lazy"
                        />
                      ) : (
                        <div className="business-dealership-placeholder">
                          No Image Available
                        </div>
                      )}

                      <span className="business-dealership-type">
                        {dealership.vehicle_type || "Dealership"}
                      </span>
                    </div>

                    <div className="business-dealership-content">
                      <h3>{dealership.business_name}</h3>

                      <p className="business-dealership-location">
                        <span>📍</span>
                        {[
                          dealership.city,
                          dealership.country,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Location not specified"}
                      </p>

                      {dealership.dealership_deals_in && (
                        <p className="business-dealership-speciality">
                          Deals in: {dealership.dealership_deals_in}
                        </p>
                      )}

                      {dealership.address && (
                        <p className="business-dealership-address">
                          {dealership.address}
                        </p>
                      )}

                      <div className="business-dealership-actions">
                        {dealership.phone && (
                          <a href={`tel:${dealership.phone}`}>
                            Contact Dealer
                          </a>
                        )}

                        {dealership.web && (
                          <a
                            href={
                              dealership.web.startsWith("http")
                                ? dealership.web
                                : `https://${dealership.web}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="business-dealership-website"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default DealershipListing;
