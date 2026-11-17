
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSaleById, getHireById } from "../../api/listing.api";
import "./ListingDetails.css";

const API_BASE = "http://localhost:5000";

const dummyListings = {
  "demo-supreme-001": {
    sale_id: "demo-supreme-001",
    listing_id: "demo-supreme-001",
    listing_type: "sale",
    promotion_plan: "supreme",
    vehicle_type: "car",
    title: "BMW 5 Series 530i M Sport 2024",
    make: "BMW",
    model: "5 Series",
    version: "530i M Sport",
    year: 2024,
    display_price: 28500000,
    price: 28500000,
    city: "Lahore",
    registration_city: "Lahore",
    location: "Lahore",
    condition: "Used",
    mileage: 8500,
    fuel_type: "Petrol",
    transmission: "Automatic",
    description:
      "Experience premium German engineering with this stunning BMW 530i M Sport. Featuring a luxurious interior, advanced technology, powerful performance, elegant exterior styling and exceptional comfort. Carefully maintained with an excellent service record.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
    ],
  },
};

const getImages = (images) => {
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
    .filter(Boolean)
    .map((image) => {
      const filename =
        typeof image === "string"
          ? image
          : image.url || image.filename || image.path || "";

      if (!filename) return "";

      if (/^https?:\/\//i.test(filename)) {
        return filename;
      }

      const cleanFilename = filename
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/^uploads\//, "");

      return `${API_BASE}/uploads/${cleanFilename}`;
    })
    .filter(Boolean);
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

const getPlan = (listing) => {
  const plan = String(
    listing?.promotion_plan ||
      listing?.ad_plan ||
      listing?.listing_plan ||
      "normal"
  )
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  if (plan === "supreme") return "supreme";
  if (plan === "hotspot") return "hotspot";

  return "normal";
};

function ListingDetails({ type: typeProp }) {
  const { id, type: routeType } = useParams();
  const navigate = useNavigate();

  const listingType =
    typeProp || routeType || dummyListings[id]?.listing_type || "sale";

  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");
        setListing(null);
        setImages([]);
        setSelectedImage("");

        const demoListing = dummyListings[id];

        if (demoListing) {
          if (isActive) {
            const demoImages = getImages(demoListing.images);

            setListing(demoListing);
            setImages(demoImages);
            setSelectedImage(demoImages[0] || "");
          }

          return;
        }

        const response =
          listingType === "sale"
            ? await getSaleById(id)
            : await getHireById(id);

        const result =
          response?.data?.data ??
          response?.data?.listing ??
          response?.data ??
          response;

        if (!isActive) return;

        if (!result || typeof result !== "object") {
          setError("Listing not found.");
          return;
        }

        const listingImages = getImages(result.images);

        setListing(result);
        setImages(listingImages);
        setSelectedImage(listingImages[0] || "");
      } catch (err) {
        console.error("Listing details error:", err);

        if (isActive) {
          setError(
            err?.response?.data?.message ||
              "Unable to load listing."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchListing();

    return () => {
      isActive = false;
    };
  }, [id, listingType]);

  if (loading) {
    return (
      <div className="listing-details-message">
        <div className="listing-details-spinner" />
        Loading vehicle details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="listing-details-message">
        <h2>Unable to load listing</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/listing")}>
          Back to Listings
        </button>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="listing-details-message">
        <h2>Listing not found</h2>
        <button onClick={() => navigate("/listing")}>
          Back to Listings
        </button>
      </div>
    );
  }

  const plan = getPlan(listing);

  const title =
    [listing.make, listing.model, listing.version]
      .filter(Boolean)
      .join(" ") ||
    listing.item_name ||
    listing.title ||
    listing.plant_name ||
    "Vehicle Listing";

  const price =
    listingType === "hire"
      ? listing.charges
      : listing.display_price ?? listing.price;

  const city =
    listing.registration_city ||
    listing.city ||
    listing.location ||
    "Location not specified";

  const description =
    listing.description ||
    listing.ad_description ||
    listing.item_description ||
    listing.vehicle_description ||
    "No description available.";

  // The selected photo is always the large image.
  // The next two available photos are displayed on the right.
  const sideImages = images
    .filter((image) => image !== selectedImage)
    .slice(0, 2);

  // Any remaining photos are displayed as thumbnails below.
  const additionalImages = images.filter(
    (image) =>
      image !== selectedImage && !sideImages.includes(image)
  );

  const specifications = [
    ["Vehicle Type", listing.vehicle_type],
    ["Make", listing.make],
    ["Model", listing.model],
    ["Version", listing.version],
    ["Year", listing.year],
    ["Condition", listing.condition],
    [
      "Mileage",
      listing.mileage
        ? `${Number(listing.mileage).toLocaleString()} km`
        : "",
    ],
    ["Fuel Type", listing.fuel_type],
    ["Transmission", listing.transmission],
    ["Engine Capacity", listing.engine_capacity || listing.engine_size],
    ["Body Type", listing.body_type],
    ["Color", listing.color],
    ["Registration City", listing.registration_city],
    ["Doors", listing.doors],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  const sellerName =
    listing.seller_name ||
    listing.user_name ||
    listing.owner_name ||
    listing.contact_person ||
    "";

  const sellerPhone =
    listing.phone ||
    listing.phone_number ||
    listing.contact_number ||
    listing.mobile ||
    "";

  const sellerEmail =
    listing.email ||
    listing.contact_email ||
    "";

  return (
    <main className="listing-details-page">
      <div className="listing-details-container">
        {/* BREADCRUMB */}
        <div className="listing-details-breadcrumb">
          <button onClick={() => navigate("/")}>Home</button>
          <span>/</span>
          <button onClick={() => navigate("/listing")}>
            Listings
          </button>
          <span>/</span>
          <span>{title}</span>
        </div>

        {/* VEHICLE GALLERY */}
        <section className="listing-details-gallery-section">
          <div className="listing-details-gallery">
            <div className="listing-details-gallery-grid">
              {/* LARGE MAIN IMAGE */}
              <div className="listing-details-main-image-wrapper">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt={title}
                    className="listing-details-main-image"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="listing-details-no-image">
                    No image available
                  </div>
                )}

                <span className={`listing-details-plan-badge ${plan}`}>
                  {plan === "supreme"
                    ? "SUPREME AD"
                    : plan === "hotspot"
                      ? "HOTSPOT AD"
                      : "NORMAL AD"}
                </span>
              </div>

              {/* TWO SMALL IMAGES ON THE RIGHT */}
              {sideImages.length > 0 && (
                <div className="listing-details-side-images">
                  {sideImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className="listing-details-side-image"
                      onClick={() => setSelectedImage(image)}
                      aria-label={`View vehicle image ${index + 2}`}
                    >
                      <img
                        src={image}
                        alt={`${title} ${index + 2}`}
                      />
                      <span className="listing-details-image-overlay">
                        View image
                      </span>
                    </button>
                  ))}

                  {sideImages.length === 1 && (
                    <div className="listing-details-empty-image">
                      No image available
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ADDITIONAL PHOTOS */}
            {additionalImages.length > 0 && (
              <div className="listing-details-thumbnails">
                {additionalImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    onClick={() => setSelectedImage(image)}
                    aria-label={`View additional image ${index + 4}`}
                  >
                    <img
                      src={image}
                      alt={`${title} ${index + 4}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* MAIN DETAILS */}
        <div className="listing-details-layout">
          <div className="listing-details-main-content">
            <section className="listing-details-heading-card">
              <div className="listing-details-labels">
                <span className={`listing-details-type ${listingType}`}>
                  {listingType === "sale" ? "FOR SALE" : "FOR HIRE"}
                </span>

                <span className="listing-details-category">
                  {listing.vehicle_type || "Vehicle"}
                </span>
              </div>

              <h1>{title}</h1>

              <p className="listing-details-location">
                <span>⌖</span> {city}
              </p>

              <div className="listing-details-price">
                <strong>{formatPrice(price)}</strong>

                {listingType === "hire" && listing.charges_type && (
                  <span>{listing.charges_type}</span>
                )}
              </div>
            </section>

            {/* QUICK SPECIFICATIONS */}
            <section className="listing-details-section">
              <div className="listing-details-section-heading">
                <span>VEHICLE INFORMATION</span>
                <h2>Vehicle Overview</h2>
              </div>

              <div className="listing-details-quick-specs">
                {[
                  ["Year", listing.year],
                  ["Condition", listing.condition],
                  [
                    "Mileage",
                    listing.mileage
                      ? `${Number(listing.mileage).toLocaleString()} km`
                      : "",
                  ],
                  ["Transmission", listing.transmission],
                  ["Fuel", listing.fuel_type],
                  ["Engine", listing.engine_capacity || listing.engine_size],
                ]
                  .filter(
                    ([, value]) =>
                      value !== null && value !== undefined && value !== ""
                  )
                  .map(([label, value]) => (
                    <div className="listing-details-quick-spec" key={label}>
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
              </div>
            </section>

            {/* COMPLETE SPECIFICATIONS */}
            <section className="listing-details-section">
              <div className="listing-details-section-heading">
                <span>TECHNICAL DETAILS</span>
                <h2>Specifications</h2>
              </div>

              <div className="listing-details-specifications">
                {specifications.map(([label, value]) => (
                  <div
                    className="listing-details-specification"
                    key={label}
                  >
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            {/* DESCRIPTION */}
            <section className="listing-details-section">
              <div className="listing-details-section-heading">
                <span>ABOUT THIS VEHICLE</span>
                <h2>Description</h2>
              </div>

              <p className="listing-details-description">
                {description}
              </p>
            </section>
          </div>

          {/* PRICE AND SELLER SIDEBAR */}
          <aside className="listing-details-sidebar">
            <div className="listing-details-contact-card">
              <span className="listing-details-sidebar-label">
                {listingType === "sale" ? "SELLING PRICE" : "HIRING PRICE"}
              </span>

              <h2>{formatPrice(price)}</h2>

              {listingType === "hire" && listing.charges_type && (
                <p className="listing-details-charge-period">
                  {listing.charges_type}
                </p>
              )}

              <div className="listing-details-contact-divider" />

              <h3>Seller Information</h3>

              <p className="listing-details-seller-name">
                {sellerName || "Vehicle Seller"}
              </p>

              {sellerPhone ? (
                <a
                  href={`tel:${sellerPhone}`}
                  className="listing-details-contact-button"
                >
                  Call Seller
                </a>
              ) : (
                <button
                  type="button"
                  className="listing-details-contact-button"
                  onClick={() =>
                    alert("Seller contact details are not available yet.")
                  }
                >
                  Contact Seller
                </button>
              )}

              {sellerEmail && (
                <a
                  href={`mailto:${sellerEmail}`}
                  className="listing-details-email-button"
                >
                  Email Seller
                </a>
              )}

              <p className="listing-details-safety-note">
                Always verify vehicle documents and condition before
                completing a transaction.
              </p>
            </div>
          </aside>
        </div>

        {/* BACK TO LISTINGS */}
        <div className="listing-details-back">
          <button
            type="button"
            onClick={() => navigate("/listing")}
          >
            ← Back to Listings
          </button>
        </div>
      </div>
    </main>
  );
}

export default ListingDetails;
