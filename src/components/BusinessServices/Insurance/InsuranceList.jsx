
import { useCallback, useEffect, useState } from "react";
import {
  getInsuranceListings,
  deleteInsurance,
} from "../../../api/insurance.api";

import "./InsuranceList.css";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const filename = imagePath.split(/[\\/]/).pop();

  if (!filename) return "";

  return `http://localhost:5000/uploads/${encodeURIComponent(filename)}`;
};

function InsuranceList({ onEdit, refreshKey = 0 }) {
  const [insuranceListings, setInsuranceListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchInsuranceListings = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInsuranceListings();

      // Backend response: { success, message, data }
      const data = response?.data ?? response;

      setInsuranceListings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load insurance registrations:", err);

      setInsuranceListings([]);

      setError(
        err.response?.data?.message ||
          "Unable to load your insurance registrations. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsuranceListings();
  }, [fetchInsuranceListings, refreshKey]);

  const handleDelete = async (id) => {
    if (!id) {
      setError("Invalid insurance registration ID.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this insurance registration?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteInsurance(id);

      setInsuranceListings((previous) =>
        previous.filter((insurance) => insurance.id !== id)
      );
    } catch (err) {
      console.error("Failed to delete insurance registration:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete insurance registration. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <section className="insurance-list">
        <h2>My Insurance Registrations</h2>
        <p>Loading your insurance registrations...</p>
      </section>
    );
  }

  return (
    <section className="insurance-list">
      <h2>My Insurance Registrations</h2>

      {error && (
        <div className="insurance-list-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={fetchInsuranceListings}>
            Retry
          </button>
        </div>
      )}

      {!error && insuranceListings.length === 0 && (
        <p>You haven't added any insurance registrations yet.</p>
      )}

      <div className="insurance-list-grid">
        {insuranceListings.map((insurance) => (
          <article className="insurance-list-card" key={insurance.id}>
            {insurance.insurance_img1 && (
              <img
                src={getImageUrl(insurance.insurance_img1)}
                alt={insurance.name || "Insurance business"}
                className="insurance-list-image"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            <div className="insurance-list-content">
              <h3>{insurance.name}</h3>

              <p>
                <strong>Vehicle Type:</strong> {insurance.vehicle_type}
              </p>

              <p>
                <strong>Cover:</strong> {insurance.cover}
              </p>

              <p>
                <strong>Location:</strong> {insurance.city}
              </p>

              <p>
                <strong>Phone:</strong> {insurance.phone}
              </p>

              <p>
                <strong>Email:</strong> {insurance.email}
              </p>

              <p>
                <strong>Featured Plan:</strong>{" "}
                {insurance.insurance_featured_type}
              </p>

              <p>
                <strong>Status:</strong> {insurance.post_status}
              </p>

              <div className="insurance-list-actions">
                <button
                  type="button"
                  onClick={() => onEdit?.(insurance)}
                  disabled={deletingId === insurance.id}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(insurance.id)}
                  disabled={deletingId === insurance.id}
                >
                  {deletingId === insurance.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default InsuranceList;
