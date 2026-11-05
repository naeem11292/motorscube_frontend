
import { useCallback, useEffect, useState } from "react";
import {
  getDealerships,
  deleteDealership,
} from "../../api/dealership.api";

// Convert backend Windows/Unix file paths into browser-accessible URLs.
const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  // Already an HTTP URL
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Extract filename from Windows or Unix path
  const filename = imagePath.split(/[\\/]/).pop();

  if (!filename) return "";

  return `http://localhost:5000/uploads/${encodeURIComponent(filename)}`;
};

function DealershipList({ onEdit, refreshKey = 0 }) {
  const [dealerships, setDealerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // Fetch dealership registrations
  const fetchDealerships = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDealerships();

      // API response: { success: true, data: [...] }
      const data = response?.data ?? response;

      setDealerships(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load dealerships:", err);

      setDealerships([]);
      setError(
        "We couldn't load your dealership registrations right now. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDealerships();
  }, [fetchDealerships, refreshKey]);

  // Delete dealership
  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid dealership ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this dealership?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteDealership(id);

      // Remove deleted dealership from the displayed list
      setDealerships((previous) =>
        previous.filter((dealership) => dealership.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete dealership:", err);

      setError(
        "We couldn't delete this dealership. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className="dealership-list">
        <h2>My Dealerships</h2>
        <p>Loading your dealership registrations...</p>
      </section>
    );
  }

  return (
    <section className="dealership-list">
      <h2>My Dealerships</h2>

      {/* Error message and retry */}
      {error && (
        <div className="dealership-list-error" role="alert">
          <p>{error}</p>

          <button
            type="button"
            onClick={fetchDealerships}
            disabled={loading}
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty state */}
      {!error && dealerships.length === 0 && (
        <p>You haven't added any dealerships yet.</p>
      )}

      {/* Dealership cards */}
      <div className="dealership-list-grid">
        {dealerships.map((dealership) => {
          const imageUrl = getImageUrl(dealership.dealership_img1);

          return (
            <article
              className="dealership-list-card"
              key={dealership.id}
            >
              {/* Dealership image */}
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={dealership.business_name || "Dealership"}
                  className="dealership-list-image"
                  onError={(event) => {
                    console.error(
                      "Failed to load dealership image:",
                      imageUrl
                    );
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}

              <div className="dealership-list-content">
                <h3>{dealership.business_name}</h3>

                <p>
                  {dealership.city}, {dealership.country}
                </p>

                <p>
                  Vehicle Type: {dealership.vehicle_type}
                </p>

                <p>Phone: {dealership.phone}</p>

                <p>Status: {dealership.post_status}</p>

                {/* Edit and Delete */}
                <div className="dealership-list-actions">
                  <button
                    type="button"
                    onClick={() => onEdit?.(dealership)}
                    disabled={deletingId === dealership.id}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(dealership.id)}
                    disabled={deletingId === dealership.id}
                  >
                    {deletingId === dealership.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default DealershipList;
