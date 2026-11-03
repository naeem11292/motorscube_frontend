
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllListings } from "../../api/listing.api";
import MoreFilters from "./MoreFilters";
import "./Listing.css";

const API_BASE = "http://localhost:5000";
const ITEMS_PER_PAGE = 6;

const EMPTY_ADVANCED_FILTERS = {
  condition: [],
  city: [],
  registrationCity: [],
  make: [],
  model: [],
  version: [],
  fuelType: [],
  bodyType: [],
  transmission: [],
  engineType: [],
  color: [],
  adType: [],
  doors: [],
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  mileageMin: "",
  mileageMax: "",
  engineMin: "",
  engineMax: "",
  withPictures: false,
};

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

  if (/^https?:\/\//i.test(filename)) {
    return filename;
  }

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

  if (!Number.isFinite(number)) {
    return String(value);
  }

  return `PKR ${number.toLocaleString("en-PK")}`;
};

const hasPictures = (images) => {
  if (!images) return false;

  if (Array.isArray(images)) {
    return images.some(Boolean);
  }

  if (typeof images === "string") {
    try {
      const parsed = JSON.parse(images);

      if (Array.isArray(parsed)) {
        return parsed.some(Boolean);
      }

      return Boolean(parsed);
    } catch {
      return images.trim() !== "" && images !== "null";
    }
  }

  return false;
};

const Listing = () => {
  const navigate = useNavigate();

  // LISTINGS
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // MAIN SEARCH FILTERS
  const [makeModel, setMakeModel] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("all");

  // ADVANCED FILTER DRAWER
  const [advancedFilters, setAdvancedFilters] = useState({
    ...EMPTY_ADVANCED_FILTERS,
  });

  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);

  // LOAD LISTINGS
  useEffect(() => {
    const loadListings = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAllListings();

        // Supports an array or backend { success, data: [...] } response.
        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        setListings(data);
      } catch (err) {
        console.error("Loading listings failed:", err);

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

  // FILTER LISTINGS
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const combinedMakeModel = [
        item.make,
        item.model,
        item.version,
        item.plant_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const itemLocation = String(
        item.registration_city ||
          item.city ||
          item.location ||
          ""
      ).toLowerCase();

      const itemCondition = String(item.condition || "").toLowerCase();

      const itemPrice = Number(item.display_price);
      const itemYear = Number(item.year);
      const itemMileage = Number(item.mileage);
      const itemEngineSize = Number(item.engine_size);

      // MAIN FILTERS
      const matchesMakeModel = combinedMakeModel.includes(
        makeModel.trim().toLowerCase()
      );

      const matchesLocation = itemLocation.includes(
        location.trim().toLowerCase()
      );

      const matchesCondition =
        condition === "all" ||
        itemCondition === condition.toLowerCase();

      // ADVANCED CHIP FILTERS
      const matchesSelected = (key, value) => {
        const selectedValues = advancedFilters[key] || [];

        if (!selectedValues.length) {
          return true;
        }

        return selectedValues.some(
          (selectedValue) =>
            String(selectedValue).toLowerCase() ===
            String(value ?? "").toLowerCase()
        );
      };

      const matchesYearMin =
        !advancedFilters.yearMin ||
        (Number.isFinite(itemYear) &&
          itemYear >= Number(advancedFilters.yearMin));

      const matchesYearMax =
        !advancedFilters.yearMax ||
        (Number.isFinite(itemYear) &&
          itemYear <= Number(advancedFilters.yearMax));

      const matchesPriceMin =
        !advancedFilters.priceMin ||
        (Number.isFinite(itemPrice) &&
          itemPrice >= Number(advancedFilters.priceMin));

      const matchesPriceMax =
        !advancedFilters.priceMax ||
        (Number.isFinite(itemPrice) &&
          itemPrice <= Number(advancedFilters.priceMax));

      const matchesMileageMin =
        !advancedFilters.mileageMin ||
        (Number.isFinite(itemMileage) &&
          itemMileage >= Number(advancedFilters.mileageMin));

      const matchesMileageMax =
        !advancedFilters.mileageMax ||
        (Number.isFinite(itemMileage) &&
          itemMileage <= Number(advancedFilters.mileageMax));

      const matchesEngineMin =
        !advancedFilters.engineMin ||
        (Number.isFinite(itemEngineSize) &&
          itemEngineSize >= Number(advancedFilters.engineMin));

      const matchesEngineMax =
        !advancedFilters.engineMax ||
        (Number.isFinite(itemEngineSize) &&
          itemEngineSize <= Number(advancedFilters.engineMax));

      const matchesPictures =
        !advancedFilters.withPictures || hasPictures(item.images);

      return (
        matchesMakeModel &&
        matchesLocation &&
        matchesCondition &&

        matchesSelected("condition", item.condition) &&
        matchesSelected("city", item.city) &&
        matchesSelected("registrationCity", item.registration_city) &&
        matchesSelected("make", item.make) &&
        matchesSelected("model", item.model) &&
        matchesSelected("version", item.version) &&
        matchesSelected("fuelType", item.fuel_type) &&
        matchesSelected("bodyType", item.body_type) &&
        matchesSelected("transmission", item.transmission) &&
        matchesSelected("engineType", item.engine_type) &&
        matchesSelected("color", item.color) &&
        matchesSelected("adType", item.ad_type) &&
        matchesSelected("doors", item.doors) &&

        matchesYearMin &&
        matchesYearMax &&
        matchesPriceMin &&
        matchesPriceMax &&
        matchesMileageMin &&
        matchesMileageMax &&
        matchesEngineMin &&
        matchesEngineMax &&
        matchesPictures
      );
    });
  }, [
    listings,
    makeModel,
    location,
    condition,
    advancedFilters,
  ]);

  // RESET PAGINATION WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [makeModel, location, condition, advancedFilters]);

  // PAGINATION
  const totalPages = Math.ceil(
    filteredListings.length / ITEMS_PER_PAGE
  );

  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // CLEAR ALL FILTERS
  const clearFilters = () => {
    setMakeModel("");
    setLocation("");
    setCondition("all");

    setAdvancedFilters({
      ...EMPTY_ADVANCED_FILTERS,
    });

    setCurrentPage(1);
  };

  // OPEN LISTING DETAILS
  const openListing = (item) => {
    const id = item.listing_id;

    if (!id || !item.listing_type) {
      console.error("Listing ID or listing type is missing:", item);
      return;
    }

    navigate(`/listing/${item.listing_type}/${id}`);
  };

  // VEHICLE CARD
  const renderVehicleCard = (item) => {
    const imageUrl = getImageUrl(item.images);

    const title = [
      item.make,
      item.model,
      item.version,
    ]
      .filter(Boolean)
      .join(" ") ||
      item.plant_name ||
      item.vehicle_type ||
      "Vehicle Listing";

    const itemLocation =
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
              {item.listing_type === "sale"
                ? "For Sale"
                : "For Hire"}
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
            <span>⌖</span> {itemLocation}
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
            <span className="listing-eyebrow">
              MOTORSCUBE MARKETPLACE
            </span>

            <h2>Explore Vehicles</h2>

            <p>
              Find vehicles available for sale and hire.
            </p>
          </div>

          <span className="listing-count">
            {filteredListings.length} Listings
          </span>
        </div>

        {/* MAIN FILTER BAR */}
        <div className="listing-filter-wrapper">
          <div className="listing-filters">
            <input
              type="text"
              placeholder="Make & Model"
              value={makeModel}
              onChange={(event) => setMakeModel(event.target.value)}
            />

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />

            <select
              value={condition}
              onChange={(event) => setCondition(event.target.value)}
            >
              <option value="all">All Conditions</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="re-conditioned">Re-conditioned</option>
            </select>

            <button
              type="button"
              className="listing-more-filters-button"
              onClick={() => setShowMoreFilters(true)}
            >
              <span>☷</span>
              More Filters
              <span className="listing-filter-arrow">+</span>
            </button>
          </div>
        </div>

        {/* LISTING RESULTS */}
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

            <button
              type="button"
              className="listing-clear-filters"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
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
              clearFilters();
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
      {!loading &&
        !error &&
        filteredListings.length > ITEMS_PER_PAGE && (
          <section className="listing-secondary-section">
            <div className="listing-section-heading">
              <div>
                <span className="listing-eyebrow">
                  MORE TO EXPLORE
                </span>
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

          <button
            onClick={() => navigate("/dashboard/business-services")}
          >
            Explore Business Services
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="listing-footer">
        <div className="listing-footer-inner">
          <div className="listing-footer-brand">
            <h2>
              Motors<span>Cube</span>
            </h2>

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
            <a href="/dashboard/business-services">
              Business Services
            </a>
            <a href="/dashboard/stores">Stores</a>
          </div>
        </div>

        <div className="listing-footer-bottom">
          © {new Date().getFullYear()} MotorsCube. All rights reserved.
        </div>
      </footer>

      {/* ADVANCED FILTER DRAWER */}
      <MoreFilters
        open={showMoreFilters}
        onClose={() => setShowMoreFilters(false)}
        listings={listings}
        filters={advancedFilters}
        onApply={(newFilters) => {
          setAdvancedFilters(newFilters);
        }}
        onClear={clearFilters}
      />
    </main>
  );
};

export default Listing;
