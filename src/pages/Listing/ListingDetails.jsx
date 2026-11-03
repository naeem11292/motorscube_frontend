
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSaleById, getHireById } from "../../api/listing.api";
import "./ListingDetails.css";

function ListingDetails({ type }) {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          type === "sale"
            ? await getSaleById(id)
            : await getHireById(id);

        setListing(response?.data ?? response);
      } catch (err) {
        console.error("Listing details error:", err);
        setError(
          err.response?.data?.message || "Unable to load listing."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id, type]);

  if (loading) {
    return <div className="listing-details-message">Loading listing...</div>;
  }

  if (error) {
    return <div className="listing-details-message">{error}</div>;
  }

  if (!listing) {
    return <div className="listing-details-message">Listing not found.</div>;
  }

  let images = listing.images || [];

  if (typeof images === "string") {
    try {
      images = JSON.parse(images);
    } catch {
      images = [];
    }
  }

  const imageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `http://localhost:5000/uploads/${image}`;
  };

  const title =
    [listing.make, listing.model, listing.version]
      .filter(Boolean)
      .join(" ") ||
    listing.item_name ||
    "Vehicle Listing";

  const price = type === "sale" ? listing.price : listing.charges;

  return (
    <main className="listing-details-page">
      <div className="listing-details-container">
        <section className="listing-details-gallery">
          {images.length > 0 ? (
            <img
              src={imageUrl(images[0])}
              alt={title}
              className="listing-details-main-image"
            />
          ) : (
            <div className="listing-details-no-image">
              No image available
            </div>
          )}
        </section>

        <section className="listing-details-info">
          <span className="listing-details-type">
            {type === "sale" ? "FOR SALE" : "FOR HIRE"}
          </span>

          <h1>{title}</h1>

          <h2>
            {price
              ? `PKR ${Number(price).toLocaleString()}`
              : "Price on request"}
          </h2>

          {type === "hire" && listing.charges_type && (
            <p>Charge period: {listing.charges_type}</p>
          )}

          <div className="listing-details-specs">
            <p><strong>Vehicle:</strong> {listing.vehicle_type || "—"}</p>
            <p><strong>Year:</strong> {listing.year || "—"}</p>
            <p><strong>Condition:</strong> {listing.condition || "—"}</p>
            <p>
              <strong>City:</strong>{" "}
              {listing.city || listing.registration_city || "—"}
            </p>
            <p><strong>Location:</strong> {listing.location || "—"}</p>
            {type === "sale" && (
              <p><strong>Mileage:</strong> {listing.mileage || "—"}</p>
            )}
          </div>

          <h3>Description</h3>
          <p className="listing-details-description">
            {listing.description || "No description available."}
          </p>
        </section>
      </div>
    </main>
  );
}

export default ListingDetails;
