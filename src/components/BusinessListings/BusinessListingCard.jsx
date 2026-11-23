
function BusinessListingCard({
  business,
  type = "Business",
  onViewDetails,
}) {
  const businessName =
    business.business_name ||
    business.name ||
    business.dealership_name ||
    business.insurance_name ||
    business.leasing_name ||
    business.workshop_name ||
    business.importer_name ||
    business.exporter_name ||
    business.school_name ||
    business.showroom_name ||
    "Business";

  // Find the first available business image
  const images = [
    business.dealership_img1,
    business.dealership_img2,
    business.insurance_img1,
    business.leasing_img1,
    business.workshop_img1,
    business.importer_img1,
    business.exporter_img1,
    business.school_img1,
    business.driving_school_img1,
    business.showroom_img1,
  ];

  const image = images.find(
    (item) => typeof item === "string" && item.trim()
  );

  const BASE_URL = (
    import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1"
  ).replace(/\/api\/v1\/?$/, "");

  const imageUrl = image
    ? image.startsWith("http")
      ? image
      : `${BASE_URL}/${image.replace(/\\/g, "/").replace(/^\/+/, "")}`
    : null;

  const city = business.city || "";
  const country = business.country || "";

  const location =
    [city, country].filter(Boolean).join(", ") ||
    "Location not specified";

  const phone =
    business.phone ||
    business.phone_number ||
    business.contact_number;

  const website = business.web || business.website;

  const speciality =
    business.dealership_deals_in ||
    business.insurance_type ||
    business.leasing_type ||
    business.workshop_services ||
    business.importer_type ||
    business.exporter_type ||
    business.school_vehicle_type ||
    business.showroom_make;

  const displayType = type || business.vehicle_type || "Business";

  return (
    <article className="business-dealership-card">
      <div className="business-dealership-image">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={businessName}
            loading="lazy"
          />
        ) : (
          <div className="business-dealership-placeholder">
            No Image Available
          </div>
        )}

        <span className="business-dealership-type">
          {business.vehicle_type || displayType}
        </span>
      </div>

      <div className="business-dealership-content">
        <h3>{businessName}</h3>

        <p className="business-dealership-location">
          <span>📍</span> {location}
        </p>

        {speciality && (
          <p className="business-dealership-speciality">
            {speciality}
          </p>
        )}

        {business.address && (
          <p className="business-dealership-address">
            {business.address}
          </p>
        )}

        <div className="business-dealership-actions">
          {phone && (
            <a href={`tel:${phone}`}>
              Contact Business
            </a>
          )}

          {website && (
            <a
              href={
                website.startsWith("http")
                  ? website
                  : `https://${website}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="business-dealership-website"
            >
              Website
            </a>
          )}

          {onViewDetails && (
            <button
              type="button"
              onClick={() => onViewDetails(business)}
              className="business-dealership-details"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default BusinessListingCard;
