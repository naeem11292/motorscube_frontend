
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getAllListings } from "../../api/listing.api";
import { getAllBusinessListings } from "../../api/businessListings.api";
import BusinessListingCard from "../../components/BusinessListings/BusinessListingCard";

const CATEGORY_MAP = {
  car: { title: "Cars", apiValue: "car" },
  bike: { title: "Bikes", apiValue: "bike" },
  plant: { title: "Plant", apiValue: "plant" },
  machinery: { title: "Machinery", apiValue: "machinery" },
  commercial: { title: "Commercial Vehicles", apiValue: "commercial" },
};

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
).replace(/\/api\/v1\/?$/, "");

const normalize = (value) =>
  String(value || "").toLowerCase().trim().replace(/s$/, "");

const getArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.listings)) return response.listings;
  return [];
};

const getImages = (item) => {
  let images = item.images || item.image || [];

  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      images = [images];
    }
  }

  if (!Array.isArray(images)) images = [images];

  const firstImage =
    images.find((image) => typeof image === "string" && image.trim()) ||
    item.image_1 ||
    item.image1;

  if (!firstImage) return "";

  if (firstImage.startsWith("http")) return firstImage;

  return `${API_BASE}/${firstImage.replace(/^\/+/, "")}`;
};

const formatPrice = (item) => {
  const price =
    item.price ??
    item.sale_price ??
    item.hire_price ??
    item.ad_price;

  if (price === undefined || price === null || price === "") {
    return "Price not available";
  }

  return `Rs. ${Number(price).toLocaleString("en-PK")}`;
};

function ListingCard({ item, listingType }) {
  const id = item.listing_id || item.sale_id || item.hire_id || item.id;
  const image = getImages(item);

  const title =
    item.title ||
    item.ad_title ||
    item.vehicle_name ||
    [item.vehicle_make, item.vehicle_model, item.vehicle_version]
      .filter(Boolean)
      .join(" ") ||
    [item.make, item.model].filter(Boolean).join(" ") ||
    "Vehicle Advertisement";

  const location =
    item.city || item.location || item.vehicle_city || "Location not specified";

  return (
    <Link
      to={`/listing/${listingType}/${id}`}
      className="explore-listing-card"
    >
      <div className="explore-listing-image">
        {image ? (
          <img src={image} alt={title} />
        ) : (
          <div className="explore-no-image">No Image Available</div>
        )}
        <span className="explore-type-badge">
          {listingType === "sale" ? "For Sale" : "For Hire"}
        </span>
      </div>

      <div className="explore-listing-info">
        <h3>{title}</h3>
        <p className="explore-price">{formatPrice(item)}</p>
        <p className="explore-location">📍 {location}</p>
        <span className="explore-view-link">View Details →</span>
      </div>
    </Link>
  );
}

function ExploreCategory() {
  const { category } = useParams();

  const selectedCategory = CATEGORY_MAP[category];

  const [saleListings, setSaleListings] = useState([]);
  const [hireListings, setHireListings] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedCategory) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadCategoryData = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.allSettled([
          getAllListings({
            listing_type: "sale",
            vehicle_type: selectedCategory.apiValue,
          }),
          getAllListings({
            listing_type: "hire",
            vehicle_type: selectedCategory.apiValue,
          }),
          getAllBusinessListings(),
        ]);

        if (cancelled) return;

        const saleResult = results[0];
        const hireResult = results[1];
        const businessResult = results[2];

        if (saleResult.status === "fulfilled") {
          setSaleListings(getArray(saleResult.value));
        } else {
          setSaleListings([]);
          console.error("Failed to load sale listings:", saleResult.reason);
        }

        if (hireResult.status === "fulfilled") {
          setHireListings(getArray(hireResult.value));
        } else {
          setHireListings([]);
          console.error("Failed to load hire listings:", hireResult.reason);
        }

        if (businessResult.status === "fulfilled") {
          const allBusinesses = businessResult.value.flatMap((result) =>
            (result.listings || []).map((business) => ({
              ...business,
              listing_category: result.category,
            }))
          );

          const matchingBusinesses = allBusinesses.filter((business) => {
            const vehicleType =
              business.vehicle_type || business.school_vehicle_type;

            return normalize(vehicleType) === normalize(category);
          });

          setBusinesses(matchingBusinesses);
        } else {
          setBusinesses([]);
          console.error(
            "Failed to load business listings:",
            businessResult.reason
          );
        }

        if (
          saleResult.status === "rejected" &&
          hireResult.status === "rejected" &&
          businessResult.status === "rejected"
        ) {
          setError("Unable to load advertisements. Please try again.");
        }
      } catch (err) {
        console.error("Explore category error:", err);
        if (!cancelled) {
          setError("Unable to load advertisements. Please try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCategoryData();

    return () => {
      cancelled = true;
    };
  }, [category]);

  if (!selectedCategory) {
    return (
      <div className="explore-page">
        <h2>Category not found</h2>
        <Link to="/">Return to Home</Link>
      </div>
    );
  }

  return (
    <main className="explore-page">
      <style>{`
        .explore-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 35px 5%;
          color: #222;
          font-family: Arial, sans-serif;
        }

        .explore-header {
          padding: 30px;
          margin-bottom: 35px;
          border-radius: 12px;
          background: #f5f6f8;
        }

        .explore-header h1 {
          margin: 0 0 10px;
          font-size: 30px;
        }

        .explore-header p {
          margin: 0;
          color: #666;
        }

        .explore-section {
          margin-bottom: 45px;
        }

        .explore-section h2 {
          margin-bottom: 20px;
          font-size: 23px;
        }

        .explore-listing-grid,
        .explore-business-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
          gap: 22px;
        }

        .explore-listing-card {
          overflow: hidden;
          display: block;
          color: inherit;
          text-decoration: none;
          background: white;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
          transition: transform .2s, box-shadow .2s;
        }

        .explore-listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 5px 18px rgba(0,0,0,.10);
        }

        .explore-listing-image {
          height: 185px;
          position: relative;
          background: #f1f1f1;
        }

        .explore-listing-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .explore-no-image {
          height: 100%;
          display: grid;
          place-items: center;
          color: #888;
          font-size: 14px;
        }

        .explore-type-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          padding: 6px 10px;
          color: white;
          background: #e63946;
          border-radius: 5px;
          font-size: 12px;
        }

        .explore-listing-info {
          padding: 16px;
        }

        .explore-listing-info h3 {
          margin: 0 0 12px;
          font-size: 17px;
        }

        .explore-price {
          margin: 0 0 9px;
          color: #e63946;
          font-weight: bold;
        }

        .explore-location {
          color: #777;
          font-size: 13px;
        }

        .explore-view-link {
          display: inline-block;
          margin-top: 8px;
          color: #2875d0;
          font-weight: bold;
          font-size: 13px;
        }

        .explore-empty,
        .explore-loading,
        .explore-error {
          padding: 25px;
          text-align: center;
          color: #777;
          background: #f8f8f8;
          border-radius: 8px;
        }

        .explore-error {
          color: #c62828;
        }

        @media (max-width: 600px) {
          .explore-page {
            padding: 20px 15px;
          }

          .explore-header {
            padding: 22px;
          }

          .explore-header h1 {
            font-size: 25px;
          }

          .explore-listing-grid,
          .explore-business-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="explore-header">
        <h1>Explore {selectedCategory.title}</h1>
        <p>
          Browse {selectedCategory.title.toLowerCase()} for sale, hire, and
          related business services on MotorsCube.
        </p>
      </div>

      {loading && <div className="explore-loading">Loading advertisements...</div>}

      {error && <div className="explore-error">{error}</div>}

      {!loading && (
        <>
          {saleListings.length > 0 && (
            <section className="explore-section">
              <h2>{selectedCategory.title} for Sale</h2>
              <div className="explore-listing-grid">
                {saleListings.map((item, index) => (
                  <ListingCard
                    key={item.listing_id || item.sale_id || index}
                    item={item}
                    listingType="sale"
                  />
                ))}
              </div>
            </section>
          )}

          {hireListings.length > 0 && (
            <section className="explore-section">
              <h2>{selectedCategory.title} for Hire</h2>
              <div className="explore-listing-grid">
                {hireListings.map((item, index) => (
                  <ListingCard
                    key={item.listing_id || item.hire_id || index}
                    item={item}
                    listingType="hire"
                  />
                ))}
              </div>
            </section>
          )}

          {businesses.length > 0 && (
            <section className="explore-section">
              <h2>{selectedCategory.title} Businesses</h2>
              <div className="explore-business-grid">
                {businesses.map((business, index) => (
                  <BusinessListingCard
                    key={
                      business.id ||
                      business.dealership_id ||
                      business.insurance_id ||
                      business.showroom_id ||
                      index
                    }
                    business={business}
                    type={business.listing_category}
                  />
                ))}
              </div>
            </section>
          )}

          {saleListings.length === 0 &&
            hireListings.length === 0 &&
            businesses.length === 0 && (
              <div className="explore-empty">
                No advertisements are currently available in this category.
              </div>
            )}
        </>
      )}
    </main>
  );
}

export default ExploreCategory;
