
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllListings } from "../../api/listing.api";
import "./Listing.css";

const API_BASE = "http://localhost:5000";

const VEHICLE_TYPES = [
  "all",
  "car",
  "bike",
  "commercial",
  "machinery",
  "plant",
];

const getImageUrl = (images) => {
  if (!images) return "";

  let image = images;

  if (typeof image === "string") {
    try {
      image = JSON.parse(image);
    } catch {
      image = [image];
    }
  }

  if (!Array.isArray(image)) {
    image = [image];
  }

  const filename = image.find(
    (item) => typeof item === "string" && item.trim()
  );

  if (!filename) return "";

  if (/^https?:\/\//i.test(filename)) return filename;

  const cleanFilename = filename
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/^uploads\//, "");

  return `${API_BASE}/uploads/${cleanFilename}`;
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Price on request";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) return String(value);

  return `PKR ${number.toLocaleString("en-PK")}`;
};

const Listing = () => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [listingType, setListingType] = useState("all");
  const [vehicleType, setVehicleType] = useState("all");
  const [city, setCity] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllListings();
        setListings(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load listings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, []);

  const cities = useMemo(() => {
    return [
      ...new Set(
        listings
          .map((item) => item.registration_city || item.city || item.location)
          .filter(Boolean)
      ),
    ].sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const searchableText = [
        item.make,
        item.model,
        item.version,
        item.vehicle_type,
        item.registration_city,
        item.city,
        item.location,
        item.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = searchableText.includes(
        search.trim().toLowerCase()
      );

      const matchesListingType =
        listingType === "all" ||
        item.listing_type === listingType;

      const matchesVehicleType =
        vehicleType === "all" ||
        item.vehicle_type?.toLowerCase() === vehicleType;

      const itemCity = (
        item.registration_city ||
        item.city ||
        item.location ||
        ""
      ).toLowerCase();

      const matchesCity =
        city === "all" || itemCity === city.toLowerCase();

      return (
        matchesSearch &&
        matchesListingType &&
        matchesVehicleType &&
        matchesCity
      );
    });
  }, [listings, search, listingType, vehicleType, city]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, listingType, vehicleType, city]);

  const totalPages = Math.ceil(
    filteredListings.length / ITEMS_PER_PAGE
  );

  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const openListing = (item) => {
    const id = item.listing_id;

    if (!id) return;

    navigate(
      `/listing/${item.listing_type}/${id}`
    );
  };

  const renderVehicleCard = (item) => {
    const imageUrl = getImageUrl(item.images);

    const title = [
      item.make,
      item.model,
      item.version,
    ]
      .filter(Boolean)
      .join(" ") || item.plant_name || item.vehicle_type;

    const location =
      item.registration_city ||
      item.city ||
      item.location ||
      "Location not specified";

    const priceLabel =
      item.listing_type === "hire"
        ? item.charges_type
        : "";

    return (
      <article
        className="listing-card"
        key={`${item.listing_type}-${item.listing_id}`}
        onClick={() => openListing(item)}
      >
        <div className="listing-card-image">
          {imageUrl ? (
            <img src={imageUrl} alt={title} />
          ) : (
            <div className="listing-image-placeholder">
              <span>No Image</span>
            </div>
          )}
        </div>

        <div className="listing-card-content">
          <div className="listing-card-topline">
            <span
              className={`listing-type-badge ${item.listing_type}`}
            >
              {item.listing_type === "sale" ? "For Sale" : "For Hire"}
            </span>

            <span className="listing-vehicle-category">
              {item.vehicle_type || "Vehicle"}
            </span>
          </div>

          <h3>{title}</h3>

          <div className="listing-card-specs">
            {item.year && <span>{item.year}</span>}
            {item.condition && <span>{item.condition}</span>}
            {item.transmission && <span>{item.transmission}</span>}
            {item.fuel_type && <span>{item.fuel_type}</span>}
            {item.mileage && <span>{item.mileage} km</span>}
          </div>

          <p className="listing-card-location">
            <span>⌖</span> {location}
          </p>
        </div>

        <div className="listing-card-right">
          <button
            className="listing-favorite"
            type="button"
            aria-label="Add to favorites"
            onClick={(event) => {
              event.stopPropagation();
              alert("Favorites functionality will be connected later.");
            }}
          >
            ♡
          </button>

          <div className="listing-card-price">
            <strong>{formatPrice(item.display_price)}</strong>
            {priceLabel && <small>{priceLabel}</small>}
          </div>

          <button
            className="listing-view-button"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              openListing(item);
            }}
          >
            View Details
          </button>
        </div>
      </article>
    );
  };

  return (
    <main className="listing-page">
      {/* HERO */}
      <section className="listing-hero">
        <div className="listing-hero-overlay">
          <div className="listing-hero-content">
            <span className="listing-hero-label">
              DISCOVER MOTORSCUBE
            </span>

            <h1>
              Drive the Legacy
              <br />
              of Luxury
            </h1>

            <p>
              Explore vehicles for sale and hire. Find the right
              vehicle for your next journey.
            </p>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("vehicle-listings")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Listings
            </button>
          </div>
        </div>
      </section>

      {/* LISTINGS */}
      <section
        className="listing-main-section"
        id="vehicle-listings"
      >
        <div className="listing-section-heading">
          <div>
            <span className="listing-eyebrow">MOTORSCUBE MARKETPLACE</span>
            <h2>Explore Vehicles</h2>
            <p>Find vehicles available for sale and hire.</p>
          </div>

          <span className="listing-count">
            {filteredListings.length} Listings
          </span>
        </div>

        {/* FILTERS */}
        <div className="listing-filters">
          <input
            type="search"
            placeholder="Search make, model or keyword..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            value={listingType}
            onChange={(event) => setListingType(event.target.value)}
          >
            <option value="all">Sale & Hire</option>
            <option value="sale">For Sale</option>
            <option value="hire">For Hire</option>
          </select>

          <select
            value={vehicleType}
            onChange={(event) => setVehicleType(event.target.value)}
          >
            {VEHICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type === "all"
                  ? "All Vehicle Types"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="all">All Cities</option>
            {cities.map((itemCity) => (
              <option key={itemCity} value={itemCity}>
                {itemCity}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="listing-state">
            <div className="listing-spinner" />
            <p>Loading vehicle listings...</p>
          </div>
        ) : error ? (
          <div className="listing-state listing-error">
            <h3>Unable to load listings</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>
              Try Again
            </button>
          </div>
        ) : paginatedListings.length > 0 ? (
          <>
            <div className="listing-cards">
              {paginatedListings.map(renderVehicleCard)}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="listing-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setCurrentPage((page) => page - 1)
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={
                      currentPage === page ? "active" : ""
                    }
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) => page + 1)
                  }
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="listing-state">
            <h3>No vehicles found</h3>
            <p>Try changing your search or filters.</p>
          </div>
        )}
      </section>

      {/* PROMOTIONAL BANNER */}
      <section className="listing-promo listing-promo-first">
        <div className="listing-promo-content">
          <span>DISCOVER MORE</span>
          <h2>Find Your Next Dream Vehicle</h2>
          <p>
            Explore a wide range of vehicles available on MotorsCube.
          </p>
          <button
            onClick={() => {
              setListingType("sale");
              setVehicleType("all");
              setCity("all");
              setSearch("");
              document
                .getElementById("vehicle-listings")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Explore Sale Listings
          </button>
        </div>
      </section>

      {/* SECOND LISTING GROUP */}
      {!loading && !error && filteredListings.length > 0 && (
        <section className="listing-secondary-section">
          <div className="listing-section-heading">
            <div>
              <span className="listing-eyebrow">MORE TO EXPLORE</span>
              <h2>More Vehicles</h2>
            </div>
          </div>

          <div className="listing-cards">
            {filteredListings
              .slice(ITEMS_PER_PAGE, ITEMS_PER_PAGE * 2)
              .map(renderVehicleCard)}
          </div>
        </section>
      )}

      {/* BUSINESS PROMO */}
      <section className="listing-promo listing-promo-business">
        <div className="listing-promo-content">
          <span>GROW WITH MOTORSCUBE</span>
          <h2>Advertise Your Business Here</h2>
          <p>
            Reach vehicle buyers and connect with customers through
            MotorsCube.
          </p>
          <button onClick={() => navigate("/dashboard/business-services")}>
            Explore Business Services
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="listing-footer">
        <div className="listing-footer-inner">
          <div className="listing-footer-brand">
            <h2>Motors<span>Cube</span></h2>
            <p>Your journey. Your vehicle. Your MotorsCube.</p>
          </div>

          <div>
            <h4>Marketplace</h4>
            <a href="/listing">All Listings</a>
            <a href="/listing">Vehicles for Sale</a>
            <a href="/listing">Vehicles for Hire</a>
          </div>

          <div>
            <h4>Account</h4>
            <a href="/login">Sign In</a>
            <a href="/signup">Create Account</a>
            <a href="/careers">Careers</a>
          </div>

          <div>
            <h4>MotorsCube</h4>
            <a href="/dashboard/business-services">Business Services</a>
            <a href="/dashboard/stores">Stores</a>
          </div>
        </div>

        <div className="listing-footer-bottom">
          © {new Date().getFullYear()} MotorsCube. All rights reserved.
        </div>
      </footer>
    </main>
  );
};

export default Listing;
