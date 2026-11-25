
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSaleById, getHireById } from "../../api/listing.api";
import "./ListingDetails.css";

const API_BASE = "http://localhost:5000";
const MAX_GALLERY_IMAGES = 30;

const DUMMY_LISTINGS = {
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
    price: 28500000,
    display_price: 28500000,
    city: "Lahore",
    registration_city: "Lahore",
    location: "Lahore",
    condition: "Used",
    mileage: 8500,
    fuel_type: "Petrol",
    transmission: "Automatic",
    seller_name: "MotorsCube Advertiser",
    phone: "",
    description:
      "Experience premium German engineering with this stunning BMW 530i M Sport. Featuring a luxurious interior, advanced technology, powerful performance, elegant exterior styling and exceptional comfort. Carefully maintained with an excellent service record.",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
    ],
  },
};

// --------------------------------------------------
// IMAGE HELPER
// --------------------------------------------------

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
    .map((image) => {
      const filename =
        typeof image === "string"
          ? image
          : image?.url ||
            image?.image_url ||
            image?.imageUrl ||
            image?.filename ||
            image?.path ||
            image?.src ||
            "";

      if (!filename || typeof filename !== "string") return "";

      if (/^https?:\/\//i.test(filename)) {
        return filename;
      }

      const cleanFilename = filename
        .replace(/\\/g, "/")
        .replace(/^\/+/, "")
        .replace(/^uploads\//, "");

      return `${API_BASE}/uploads/${cleanFilename}`;
    })
    .filter(Boolean)
    .filter((image, index, array) => array.indexOf(image) === index)
    .slice(0, MAX_GALLERY_IMAGES);
};

// --------------------------------------------------
// OTHER HELPERS
// --------------------------------------------------

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") {
    return "Price on request";
  }

  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return String(value);
  }

  return `PKR ${amount.toLocaleString("en-PK")}`;
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

  return ["supreme", "hotspot"].includes(plan) ? plan : "normal";
};

const getAdvertiserName = (listing) =>
  listing?.seller_name ||
  listing?.user_name ||
  listing?.owner_name ||
  listing?.contact_person ||
  listing?.advertiser_name ||
  listing?.name ||
  "Advertiser";

const getAdvertiserPhone = (listing) =>
  listing?.phone ||
  listing?.phone_number ||
  listing?.contact_number ||
  listing?.mobile ||
  listing?.contact ||
  listing?.advertiser_phone ||
  "";

// --------------------------------------------------
// COMPONENT
// --------------------------------------------------

function ListingDetails({ type: typeProp }) {
  const { id, type: routeType } = useParams();
  const navigate = useNavigate();

  const listingType =
    typeProp || routeType || DUMMY_LISTINGS[id]?.listing_type || "sale";

  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ------------------------------------------------
  // FETCH LISTING
  // ------------------------------------------------

  useEffect(() => {
    let isActive = true;

    const fetchListing = async () => {
      setLoading(true);
      setError("");
      setListing(null);
      setImages([]);
      setSelectedImage("");
      setGalleryOpen(false);
      setGalleryIndex(0);

      try {
        const demoListing = DUMMY_LISTINGS[id];

        if (demoListing) {
          if (!isActive) return;

          const demoImages = getImages(demoListing.images);

          setListing(demoListing);
          setImages(demoImages);
          setSelectedImage(demoImages[0] || "");
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
              "Unable to load listing. Please try again."
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchListing();
    } else {
      setError("Invalid listing ID.");
      setLoading(false);
    }

    return () => {
      isActive = false;
    };
  }, [id, listingType]);

  // ------------------------------------------------
  // OPEN FULL-SCREEN GALLERY
  // ------------------------------------------------

  const openGallery = (image) => {
    if (!images.length) return;

    const index = images.indexOf(image);
    const nextIndex = index >= 0 ? index : 0;

    setGalleryIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
    setGalleryOpen(true);
  };

  // ------------------------------------------------
  // CHANGE GALLERY IMAGE
  // ------------------------------------------------

  const changeGalleryImage = (index) => {
    if (!images.length) return;

    const nextIndex = (index + images.length) % images.length;

    setGalleryIndex(nextIndex);
    setSelectedImage(images[nextIndex]);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
  };

  // ------------------------------------------------
  // KEYBOARD NAVIGATION + BODY SCROLL LOCK
  // ------------------------------------------------

  useEffect(() => {
    if (!galleryOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowRight") {
        changeGalleryImage(galleryIndex + 1);
      }

      if (event.key === "ArrowLeft") {
        changeGalleryImage(galleryIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [galleryOpen, galleryIndex, images.length]);

  // ------------------------------------------------
  // LOADING STATE
  // ------------------------------------------------

  if (loading) {
    return (
      <div className="listing-details-message">
        <div className="listing-details-spinner" />
        <p>Loading vehicle details...</p>
      </div>
    );
  }

  // ------------------------------------------------
  // ERROR STATE
  // ------------------------------------------------

  if (error || !listing) {
    return (
      <div className="listing-details-message">
        <h2>{error ? "Unable to load listing" : "Listing not found"}</h2>
        {error && <p>{error}</p>}

        <button onClick={() => navigate("/listing")}>
          Back to Listings
        </button>
      </div>
    );
  }

  // ------------------------------------------------
  // LISTING DATA
  // ------------------------------------------------

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

  const advertiserName = getAdvertiserName(listing);
  const advertiserPhone = getAdvertiserPhone(listing);

  const phoneLink = advertiserPhone
    ? `tel:${String(advertiserPhone).replace(/[^\d+]/g, "")}`
    : "";

  // ------------------------------------------------
  // GALLERY DISPLAY IMAGES
  // ------------------------------------------------

  const sideImages = images
    .filter((image) => image !== selectedImage)
    .slice(0, 2);

  const additionalImages = images.filter(
    (image) =>
      image !== selectedImage && !sideImages.includes(image)
  );

  // ------------------------------------------------
  // VEHICLE SPECIFICATIONS
  // ------------------------------------------------

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

  const quickSpecifications = [
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
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <main className="listing-details-page">
      <div className="listing-details-container">

        {/* BREADCRUMB */}
        <nav className="listing-details-breadcrumb">
          <button onClick={() => navigate("/")}>Home</button>
          <span>/</span>
          <button onClick={() => navigate("/listing")}>
            Listings
          </button>
          <span>/</span>
          <span>{title}</span>
        </nav>

        {/* VEHICLE IMAGE GALLERY */}
        <section className="listing-details-gallery-section">
          <div className="listing-details-gallery">

            <div className="listing-details-gallery-grid">

              {/* MAIN IMAGE */}
              <div className="listing-details-main-image-wrapper">
                {selectedImage ? (
                  <button
                    type="button"
                    className="listing-details-main-image-button"
                    onClick={() => openGallery(selectedImage)}
                    aria-label="Open full-screen image gallery"
                  >
                    <img
                      src={selectedImage}
                      alt={title}
                      className="listing-details-main-image"
                    />
                    <span className="listing-details-open-gallery">
                      <span>⛶</span> View all photos
                    </span>
                  </button>
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

                {images.length > 0 && (
                  <span className="listing-details-photo-count">
                    {images.length} Photos
                  </span>
                )}
              </div>

              {/* SIDE IMAGES */}
              {sideImages.length > 0 && (
                <div className="listing-details-side-images">
                  {sideImages.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className="listing-details-side-image"
                      onClick={() => {
                        setSelectedImage(image);
                        openGallery(image);
                      }}
                      aria-label={`Open photo ${images.indexOf(image) + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${title} ${images.indexOf(image) + 1}`}
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

            {/* ALL REMAINING THUMBNAILS */}
            {additionalImages.length > 0 && (
              <div className="listing-details-thumbnails">
                {additionalImages.map((image) => {
                  const imageIndex = images.indexOf(image);

                  return (
                    <button
                      type="button"
                      key={`${image}-${imageIndex}`}
                      onClick={() => {
                        setSelectedImage(image);
                        openGallery(image);
                      }}
                      aria-label={`Open photo ${imageIndex + 1}`}
                    >
                      <img
                        src={image}
                        alt={`${title} photo ${imageIndex + 1}`}
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {images.length > 0 && (
              <button
                type="button"
                className="listing-details-view-all-photos"
                onClick={() => openGallery(selectedImage || images[0])}
              >
                View all {images.length} photos
              </button>
            )}

            {images.length === 0 && (
              <p className="listing-details-no-photos">
                No photos have been uploaded for this listing.
              </p>
            )}
          </div>
        </section>

        {/* DETAILS AND SIDEBAR */}
        <div className="listing-details-layout">

          {/* MAIN CONTENT */}
          <div className="listing-details-main-content">

            {/* VEHICLE HEADING */}
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

            {/* VEHICLE OVERVIEW */}
            <section className="listing-details-section">
              <div className="listing-details-section-heading">
                <span>VEHICLE INFORMATION</span>
                <h2>Vehicle Overview</h2>
              </div>

              <div className="listing-details-quick-specs">
                {quickSpecifications.map(([label, value]) => (
                  <div className="listing-details-quick-spec" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </section>

            {/* TECHNICAL SPECIFICATIONS */}
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

          {/* RIGHT SIDEBAR */}
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

              <h3>Advertiser Information</h3>

              <p className="listing-details-seller-name">
                {advertiserName}
              </p>

              {advertiserPhone ? (
                <a
                  href={phoneLink}
                  className="listing-details-contact-button"
                >
                  Call Advertiser
                </a>
              ) : (
                <p className="listing-details-no-contact">
                  Contact number unavailable
                </p>
              )}

              <p className="listing-details-safety-note">
                Always verify vehicle documents and condition before
                completing a transaction.
              </p>
            </div>
          </aside>
        </div>

        {/* BACK BUTTON */}
        <div className="listing-details-back">
          <button
            type="button"
            onClick={() => navigate("/listing")}
          >
            ← Back to Listings
          </button>
        </div>
      </div>

      {/* =========================================
          FULL-SCREEN PHOTO GALLERY
      ========================================= */}

      {galleryOpen && images.length > 0 && (
        <div
          className="listing-gallery-modal"
          onClick={closeGallery}
          role="dialog"
          aria-modal="true"
          aria-label="Vehicle photo gallery"
        >
          <button
            type="button"
            className="listing-gallery-close"
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            ×
          </button>

          <div
            className="listing-gallery-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="listing-gallery-topbar">
              <span>{title}</span>
              <span>
                {galleryIndex + 1} / {images.length}
              </span>
            </div>

            <div className="listing-gallery-main">
              {images.length > 1 && (
                <button
                  type="button"
                  className="listing-gallery-arrow listing-gallery-prev"
                  onClick={() => changeGalleryImage(galleryIndex - 1)}
                  aria-label="Previous photo"
                >
                  &#10094;
                </button>
              )}

              <img
                src={images[galleryIndex]}
                alt={`${title} photo ${galleryIndex + 1}`}
                className="listing-gallery-full-image"
              />

              {images.length > 1 && (
                <button
                  type="button"
                  className="listing-gallery-arrow listing-gallery-next"
                  onClick={() => changeGalleryImage(galleryIndex + 1)}
                  aria-label="Next photo"
                >
                  &#10095;
                </button>
              )}
            </div>

            <div className="listing-gallery-counter">
              Photo {galleryIndex + 1} of {images.length}
            </div>

            <div className="listing-gallery-thumbnails">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={`${image}-${index}`}
                  className={
                    galleryIndex === index
                      ? "active"
                      : ""
                  }
                  onClick={() => changeGalleryImage(index)}
                  aria-label={`Select photo ${index + 1}`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>

            <p className="listing-gallery-keyboard-hint">
              Use ← → arrow keys to browse · Press ESC to close
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default ListingDetails;
