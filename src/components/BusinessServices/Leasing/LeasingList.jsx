
import { useEffect, useState } from "react";
import {
  getLeasingListings,
  deleteLeasing,
} from "../../../api/leasing.api";

import "./LeasingList.css";

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const filename = path.split(/[\\/]/).pop();
  return `http://localhost:5000/uploads/${filename}`;
};

function LeasingList({ onEdit, refreshKey = 0 }) {
  const [leasingList, setLeasingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeasing = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLeasingListings();
      const rows = response?.data ?? response;

      setLeasingList(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.error("Failed to load Leasing registrations:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load Leasing registrations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeasing();
  }, [refreshKey]);

  const handleDelete = async (leasing) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${leasing.name}"?`
    );

    if (!confirmed) return;

    try {
      await deleteLeasing(leasing.id);

      setLeasingList((previous) =>
        previous.filter((item) => item.id !== leasing.id)
      );
    } catch (err) {
      console.error("Failed to delete Leasing registration:", err);

      window.alert(
        err.response?.data?.message ||
          "Unable to delete Leasing registration."
      );
    }
  };

  if (loading) {
    return <p>Loading Leasing registrations...</p>;
  }

  if (error) {
    return (
      <div className="leasing-list-error">
        <p>{error}</p>
        <button type="button" onClick={fetchLeasing}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="leasing-list">
      {leasingList.length === 0 ? (
        <p className="leasing-empty-message">
          You have not registered any Leasing businesses yet.
        </p>
      ) : (
        <div className="leasing-list-grid">
          {leasingList.map((leasing) => (
            <article className="leasing-card" key={leasing.id}>
              {leasing.leasing_img1 && (
                <img
                  className="leasing-card-image"
                  src={getImageUrl(leasing.leasing_img1)}
                  alt={leasing.name}
                />
              )}

              <div className="leasing-card-content">
                <h3>{leasing.name}</h3>

                <p>
                  <strong>Vehicle Type:</strong>{" "}
                  {leasing.vehicle_type}
                </p>

                <p>
                  <strong>City:</strong> {leasing.city}
                </p>

                <p>
                  <strong>Address:</strong> {leasing.address}
                </p>

                <p>
                  <strong>Phone:</strong> {leasing.phone}
                </p>

                <p>
                  <strong>Email:</strong> {leasing.email}
                </p>

                <p>
                  <strong>Website:</strong>{" "}
                  {leasing.web ? (
                    <a
                      href={leasing.web}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Visit Website
                    </a>
                  ) : (
                    "Not provided"
                  )}
                </p>

                <p>
                  <strong>Featured Plan:</strong>{" "}
                  {leasing.leasing_featured_type}
                </p>

                <p>
                  <strong>Status:</strong> {leasing.post_status}
                </p>

                <p>
                  <strong>Services:</strong>{" "}
                  {leasing.leasing_deals_in || "Not specified"}
                </p>

                <p className="leasing-card-description">
                  {leasing.leasing_description}
                </p>

                <div className="leasing-card-actions">
                  <button
                    type="button"
                    className="leasing-edit-button"
                    onClick={() => onEdit(leasing)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="leasing-delete-button"
                    onClick={() => handleDelete(leasing)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default LeasingList;
