
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAllListings } from "../../api/listing.api";
import FeaturedDealerships from "../../components/Dealership/FeaturedDealerships";
import MoreFilters from "./MoreFilters";
import "./Listing.css";

const API_BASE = "http://localhost:5000";
const ITEMS_PER_PAGE = 6;

// TEMPORARY DEMO PROMOTION ADS
const DEMO_PROMOTION_ADS = [
  {
    listing_id: "demo-hotspot-001",
    listing_type: "sale",
    promotion_plan: "hotspot",
    make: "Toyota",
    model: "Fortuner",
    version: "2.8 Sigma 4",
    vehicle_type: "car",
    year: 2023,
    condition: "Used",
    transmission: "Automatic",
    fuel_type: "Diesel",
    mileage: 18000,
    registration_city: "Islamabad",
    display_price: 14500000,
    description:
      "Well-maintained Toyota Fortuner with excellent condition, comfortable interior, powerful diesel engine and complete service history.",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=85",
    ],
  },
  {
    listing_id: "demo-supreme-001",
    listing_type: "sale",
    promotion_plan: "supreme",
    make: "BMW",
    model: "5 Series",
    version: "530i M Sport",
    vehicle_type: "car",
    year: 2024,
    condition: "Used",
    transmission: "Automatic",
    fuel_type: "Petrol",
    mileage: 8500,
    registration_city: "Lahore",
    display_price: 28500000,
    description:
      "Experience premium German engineering with this stunning BMW 530i M Sport. Featuring a luxurious interior, advanced technology, powerful performance, elegant exterior styling and exceptional comfort. Carefully maintained with an excellent service record.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
    ],
  },
  {
    listing_id: "demo-hotspot-002",
    listing_type: "sale",
    promotion_plan: "hotspot",
    make: "Honda",
    model: "Civic",
    version: "RS Turbo",
    vehicle_type: "car",
    year: 2022,
    condition: "Used",
    transmission: "Automatic",
    fuel_type: "Petrol",
    mileage: 25000,
    registration_city: "Rawalpindi",
    display_price: 9200000,
    description:
      "Honda Civic RS Turbo in excellent condition with a comfortable interior, sporty design and smooth automatic transmission.",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
    ],
  },
];

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

// IMAGE URLS
const getImageUrls = (images) => {
  if (!images) return [];

  let parsedImages = images;

  if (typeof parsedImages === "string") {
    try {
      parsedImages = JSON.parse(parsedImages);
    } catch {
      parsedImages = [parsedImages];
    }
  }

  if (!Array.isArray(parsedImages)) {
    parsedImages = [parsedImages];
  }

  return parsedImages
    .filter(
      (image) =>
        typeof image === "string" && image.trim()
    )
    .map((filename) => {
      if (/^https?:\/\//i.test(filename)) {
        return filename;
      }

      const cleanFilename = filename
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/^uploads\//, "");

      return `${API_BASE}/uploads/${cleanFilename}`;
    });
};

// PRICE
const formatPrice = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Price on request";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return String(value);
  }

  return `PKR ${number.toLocaleString("en-PK")}`;
};

// PICTURES
const hasPictures = (images) =>
  getImageUrls(images).length > 0;

// PROMOTION PLAN
const getListingPlan = (item) => {
  const plan = String(
    item.promotion_plan ||
      item.ad_plan ||
      item.listing_plan ||
      "normal"
  )
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (plan === "hotspot") return "hotspot";
  if (plan === "supreme") return "supreme";

  return "normal";
};

// DESCRIPTION
const getListingDescription = (item) =>
  item.description ||
  item.ad_description ||
  item.item_description ||
  item.vehicle_description ||
  "";

const limitDescription = (description, limit) => {
  const value = String(description || "").trim();

  if (value.length <= limit) return value;

  return `${value.slice(0, limit).trimEnd()}...`;
};

const Listing = () => {
  const navigate = useNavigate();

  const [selectedListingType, setSelectedListingType] =
    useState("");

  const [selectedVehicleType, setSelectedVehicleType] =
    useState("");

  const vehicleCategories = [
    { label: "Car", value: "car", icon: "🚗" },
    { label: "Bike", value: "bike", icon: "🏍️" },
    { label: "Commercial", value: "commercial", icon: "🚚" },
    { label: "Plant", value: "plant", icon: "🏗️" },
    { label: "Machinery", value: "machinery", icon: "⚙️" },
  ];

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [makeModel, setMakeModel] = useState("");
  const [location, setLocation] = useState("");
  const [condition, setCondition] = useState("all");

  const [advancedFilters, setAdvancedFilters] = useState({
    ...EMPTY_ADVANCED_FILTERS,
  });

  const [showMoreFilters, setShowMoreFilters] =
    useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  // LOAD BACKEND LISTINGS
  useEffect(() => {
    if (!selectedListingType || !selectedVehicleType) {
      setListings([]);
      setLoading(false);
      setError("");
      return;
    }

    let isActive = true;

    const loadListings = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await getAllListings({
          listing_type: selectedListingType,
          vehicle_type: selectedVehicleType,
        });

        const result =
          Array.isArray(response)
            ? response
            : Array.isArray(response?.data?.data)
              ? response.data.data
              : Array.isArray(response?.data?.listings)
                ? response.data.listings
                : Array.isArray(response?.data)
                  ? response.data
                  : [];

        if (isActive) {
          setListings(result);
        }
      } catch (apiError) {
        console.error("Listing API error:", apiError);

        if (isActive) {
          setListings([]);
          setError(
            apiError?.response?.data?.message ||
              "Unable to load vehicle listings."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadListings();

    return () => {
      isActive = false;
    };
  }, [selectedListingType, selectedVehicleType]);

  // COMBINE DEMO ADS WITH BACKEND LISTINGS
  const allListings = useMemo(() => {
    const showDemoAds =
      selectedListingType === "sale" &&
      selectedVehicleType === "car";

    if (!showDemoAds) {
      return listings;
    }

    const demoIds = new Set(
      DEMO_PROMOTION_ADS.map((item) =>
        String(item.listing_id)
      )
    );

    const realListings = listings.filter(
      (item) =>
        !demoIds.has(String(item.listing_id))
    );

    return [...DEMO_PROMOTION_ADS, ...realListings];
  }, [
    listings,
    selectedListingType,
    selectedVehicleType,
  ]);

  // FILTER DEMO AND BACKEND LISTINGS TOGETHER
  const filteredListings = useMemo(() => {
    return allListings.filter((item) => {
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

      const itemCondition = String(
        item.condition || ""
      ).toLowerCase();

      const itemPrice = Number(item.display_price);
      const itemYear = Number(item.year);
      const itemMileage = Number(item.mileage);
      const itemEngineSize = Number(item.engine_size);

      const matchesMakeModel =
        combinedMakeModel.includes(
          makeModel.trim().toLowerCase()
        );

      const matchesLocation =
        itemLocation.includes(
          location.trim().toLowerCase()
        );

      const matchesCondition =
        condition === "all" ||
        itemCondition === condition.toLowerCase();

      const matchesSelected = (key, value) => {
        const selectedValues = advancedFilters[key] || [];

        if (!selectedValues.length) return true;

        return selectedValues.some(
          (selectedValue) =>
            String(selectedValue).toLowerCase() ===
            String(value ?? "").toLowerCase()
        );
      };

      const matchesRange = (minimum, maximum, value) => {
        const minMatch =
          !minimum ||
          (Number.isFinite(value) &&
            value >= Number(minimum));

        const maxMatch =
          !maximum ||
          (Number.isFinite(value) &&
            value <= Number(maximum));

        return minMatch && maxMatch;
      };

      const matchesPictures =
        !advancedFilters.withPictures ||
        hasPictures(item.images);

      return (
        matchesMakeModel &&
        matchesLocation &&
        matchesCondition &&
        matchesSelected("condition", item.condition) &&
        matchesSelected("city", item.city) &&
        matchesSelected(
          "registrationCity",
          item.registration_city
        ) &&
        matchesSelected("make", item.make) &&
        matchesSelected("model", item.model) &&
        matchesSelected("version", item.version) &&
        matchesSelected("fuelType", item.fuel_type) &&
        matchesSelected("bodyType", item.body_type) &&
        matchesSelected(
          "transmission",
          item.transmission
        ) &&
        matchesSelected("engineType", item.engine_type) &&
        matchesSelected("color", item.color) &&
        matchesSelected("adType", item.ad_type) &&
        matchesSelected("doors", item.doors) &&
        matchesRange(
          advancedFilters.yearMin,
          advancedFilters.yearMax,
          itemYear
        ) &&
        matchesRange(
          advancedFilters.priceMin,
          advancedFilters.priceMax,
          itemPrice
        ) &&
        matchesRange(
          advancedFilters.mileageMin,
          advancedFilters.mileageMax,
          itemMileage
        ) &&
        matchesRange(
          advancedFilters.engineMin,
          advancedFilters.engineMax,
          itemEngineSize
        ) &&
        matchesPictures
      );
    });
  }, [
    allListings,
    makeModel,
    location,
    condition,
    advancedFilters,
  ]);

  const displayListings = filteredListings;

  // RESET PAGE WHEN FILTERS CHANGE
  useEffect(() => {
    setCurrentPage(1);
  }, [
    makeModel,
    location,
    condition,
    advancedFilters,
    selectedListingType,
    selectedVehicleType,
  ]);

  // PAGINATION
  const totalPages = Math.ceil(
    displayListings.length / ITEMS_PER_PAGE
  );

  const paginatedListings = displayListings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // CLEAR FILTERS
  const clearFilters = () => {
    setMakeModel("");
    setLocation("");
    setCondition("all");
    setAdvancedFilters({
      ...EMPTY_ADVANCED_FILTERS,
    });
    setCurrentPage(1);
  };

  // CHANGE SALE / HIRE
  const handleListingTypeChange = (type) => {
    setSelectedListingType(type);
    setSelectedVehicleType("");
    setListings([]);
    setCurrentPage(1);
    clearFilters();
    setShowMoreFilters(false);
  };

  // CHANGE VEHICLE CATEGORY
  const handleVehicleTypeChange = (type) => {
    setSelectedVehicleType(type);
    setCurrentPage(1);
    clearFilters();
    setShowMoreFilters(false);
  };

  // OPEN DETAILS
  const openListing = (item) => {
    if (!item.listing_id || !item.listing_type) {
      console.error("Listing ID/type missing:", item);
      return;
    }

    navigate(
      `/listing/${item.listing_type}/${item.listing_id}`
    );
  };

  // IMAGE RENDERER
  const renderImage = (url, alt, className) => (
    <div className={className}>
      {url ? (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <div className="listing-image-placeholder">
          No Image
        </div>
      )}
    </div>
  );

  // VEHICLE CARD
  const renderVehicleCard = (item) => {
    const plan = getListingPlan(item);
    const imageUrls = getImageUrls(item.images);

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

    const description = getListingDescription(item);

    const priceLabel =
      item.listing_type === "hire"
        ? item.charges_type
        : "";

    return (
      <article
        className={`listing-card ${plan}-ad`}
        key={`${item.listing_type}-${item.listing_id}`}
        onClick={() => openListing(item)}
      >
        {plan !== "supreme" &&
          renderImage(
            imageUrls[0],
            title,
            "listing-card-image"
          )}

        {plan === "supreme" && (
          <div className="listing-card-gallery">
            {renderImage(
              imageUrls[0],
              `${title} main image`,
              "gallery-main"
            )}

            {renderImage(
              imageUrls[1],
              `${title} second image`,
              "gallery-small"
            )}

            {renderImage(
              imageUrls[2],
              `${title} third image`,
              "gallery-small"
            )}
          </div>
        )}

        <div className="listing-card-content">
          <span className="listing-plan-badge">
            {plan === "normal"
              ? "Normal Ad"
              : plan === "hotspot"
                ? "Hotspot Ad"
                : "Supreme Ad"}
          </span>

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

          {plan !== "normal" && (
            <div className="listing-card-specs">
              {item.year && <span>{item.year}</span>}
              {item.condition && (
                <span>{item.condition}</span>
              )}
              {item.transmission && (
                <span>{item.transmission}</span>
              )}
              {item.fuel_type && (
                <span>{item.fuel_type}</span>
              )}
              {item.mileage && (
                <span>
                  {Number(item.mileage).toLocaleString()} km
                </span>
              )}
            </div>
          )}

          {plan !== "normal" && description && (
            <p className="listing-description">
              {limitDescription(
                description,
                plan === "supreme" ? 350 : 200
              )}
            </p>
          )}

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
              alert(
                "Favorites functionality will be connected later."
              );
            }}
          >
            ♡
          </button>

          <div className="listing-card-price">
            <strong>
              {formatPrice(item.display_price)}
            </strong>
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

      {/* MAIN LISTING SECTION */}
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
            {selectedListingType && selectedVehicleType
              ? `${displayListings.length} Listings`
              : "Choose a category"}
          </span>
        </div>

        {/* SALE / HIRE */}
        <div className="listing-selection-section">
          <div className="listing-selection-heading">
            <span className="listing-eyebrow">
              CHOOSE YOUR REQUIREMENT
            </span>

            <h2>What are you looking for?</h2>

            <p>
              Select Sale or Hire to explore available listings.
            </p>
          </div>

          <div className="listing-type-options">
            <button
              type="button"
              className={`listing-type-option ${
                selectedListingType === "sale" ? "selected" : ""
              }`}
              onClick={() => handleListingTypeChange("sale")}
              aria-pressed={selectedListingType === "sale"}
            >
              <span className="listing-option-icon">🏷️</span>
              <span className="listing-option-content">
                <strong>Sale</strong>
                <small>
                  Find vehicles available for purchase
                </small>
              </span>
              <span className="listing-option-arrow">→</span>
            </button>

            <button
              type="button"
              className={`listing-type-option ${
                selectedListingType === "hire" ? "selected" : ""
              }`}
              onClick={() => handleListingTypeChange("hire")}
              aria-pressed={selectedListingType === "hire"}
            >
              <span className="listing-option-icon">🔑</span>
              <span className="listing-option-content">
                <strong>Hire</strong>
                <small>
                  Find vehicles available for hire
                </small>
              </span>
              <span className="listing-option-arrow">→</span>
            </button>
          </div>

          {selectedListingType && (
            <div className="listing-category-section">
              <h3>
                Select a category for{" "}
                {selectedListingType === "sale" ? "Sale" : "Hire"}
              </h3>

              <p>Choose the type of vehicle you want.</p>

              <div className="listing-category-options">
                {vehicleCategories.map((category) => (
                  <button
                    type="button"
                    key={category.value}
                    className={`listing-category-option ${
                      selectedVehicleType === category.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleVehicleTypeChange(category.value)
                    }
                    aria-pressed={
                      selectedVehicleType === category.value
                    }
                  >
                    <span className="listing-category-icon">
                      {category.icon}
                    </span>
                    <strong>{category.label}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FILTERS AND RESULTS */}
        {selectedListingType && selectedVehicleType && (
          <>
            <div className="listing-filter-wrapper">
              <div className="listing-filters">
                <input
                  type="text"
                  placeholder="Make & Model"
                  value={makeModel}
                  onChange={(event) =>
                    setMakeModel(event.target.value)
                  }
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                />

                <select
                  value={condition}
                  onChange={(event) =>
                    setCondition(event.target.value)
                  }
                >
                  <option value="all">All Conditions</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="re-conditioned">
                    Re-conditioned
                  </option>
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

            {/* VEHICLE RESULTS + DEALERSHIP SIDEBAR */}
            <div className="listing-results-layout">
              <div className="listing-results-main">
                {loading && displayListings.length === 0 ? (
                  <div className="listing-state">
                    <div className="listing-spinner" />
                    <p>Loading vehicle listings...</p>
                  </div>
                ) : error && displayListings.length === 0 ? (
                  <div className="listing-state listing-error">
                    <h3>Unable to load listings</h3>
                    <p>{error}</p>

                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                    >
                      Try Again
                    </button>
                  </div>
                ) : paginatedListings.length > 0 ? (
                  <>
                    <div className="listing-cards">
                      {paginatedListings.map(renderVehicleCard)}
                    </div>

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
              </div>

              {/* RIGHT SIDE DEALERSHIPS */}
              <aside className="listing-dealership-sidebar">
                <FeaturedDealerships />
              </aside>
            </div>
          </>
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
            type="button"
            onClick={() => {
              handleListingTypeChange("sale");
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
      {selectedListingType &&
        selectedVehicleType &&
        !loading &&
        displayListings.length > ITEMS_PER_PAGE && (
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
              {displayListings
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
            type="button"
            onClick={() =>
              navigate("/dashboard/business-services")
            }
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
        listings={allListings}
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
