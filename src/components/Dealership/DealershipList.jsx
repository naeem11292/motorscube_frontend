import { useEffect, useState } from "react";
import {
  getDealerships,
  deleteDealership,
} from "../../api/dealership.api";

function DealershipList({ onEdit, refreshKey = 0 }) {
  const [dealerships, setDealerships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDealerships = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getDealerships();
      const data = response?.data ?? response;

      setDealerships(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to load dealerships."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDealerships();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this dealership?"
    );

    if (!confirmed) return;

    try {
      await deleteDealership(id);
      await fetchDealerships();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete dealership."
      );
    }
  };

  if (loading) return <p>Loading dealerships...</p>;

  return (
    <section className="dealership-list">
      <h2>My Dealerships</h2>

      {error && <p role="alert">{error}</p>}

      {!error && dealerships.length === 0 && (
        <p>You haven't added any dealerships yet.</p>
      )}

      <div className="dealership-list-grid">
        {dealerships.map((dealership) => (
          <article
            className="dealership-list-card"
            key={dealership.id}
          >
            {dealership.dealership_img1 && (
              <img
                src={dealership.dealership_img1}
                alt={dealership.business_name}
                className="dealership-list-image"
              />
            )}

            <div className="dealership-list-content">
              <h3>{dealership.business_name}</h3>
              <p>
                {dealership.city}, {dealership.country}
              </p>
              <p>{dealership.vehicle_type}</p>
              <p>{dealership.phone}</p>
              <p>Status: {dealership.post_status}</p>

              <div className="dealership-list-actions">
                <button
                  type="button"
                  onClick={() => onEdit?.(dealership)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(dealership.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DealershipList;