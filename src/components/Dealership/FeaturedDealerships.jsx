
import { useEffect, useState } from "react";
import { getDealerships } from "../../api/dealership.api";
import "./FeaturedDealerships.css";

const API_BASE = "http://localhost:5000";

const getImageUrl = (imagePath) => {
  if (!imagePath) return "";

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const filename = String(imagePath).split(/[\\/]/).pop();

  return filename
    ? `${API_BASE}/uploads/${encodeURIComponent(filename)}`
    : "";
};

function FeaturedDealerships() {
  const [dealerships, setDealerships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadDealerships = async () => {
      try {
        const response = await getDealerships();

        // Support common API response structures.
        const data = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : Array.isArray(response?.data?.data)
              ? response.data.data
              : Array.isArray(response?.data?.dealerships)
                ? response.data.dealerships
                : [];

        if (active) {
          setDealerships(data);
        }
      } catch (error) {
        console.error("Featured dealerships error:", error);
        if (active) setDealerships([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDealerships();

    return () => {
      active = false;
    };
  }, []);

  return (
    <aside className="featured-dealerships">
      <div className="featured-dealerships-heading">
        <span>OUR PARTNERS</span>
        <h2>Featured Dealerships</h2>
        <p>Explore dealerships on MotorsCube.</p>
      </div>

      {loading ? (
        <p className="featured-dealerships-message">
          Loading dealerships...
        </p>
      ) : dealerships.length === 0 ? (
        <p className="featured-dealerships-message">
          No dealerships available.
        </p>
      ) : (
        <div className="featured-dealerships-list">
          {dealerships.map((dealership) => {
            const image = getImageUrl(
              dealership.dealership_img1
            );

            return (
              <article
                className="featured-dealership-card"
                key={dealership.id}
              >
                {image ? (
                  <img
                    className="featured-dealership-image"
                    src={image}
                    alt={dealership.business_name || "Dealership"}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="featured-dealership-placeholder">
                    {String(
                      dealership.business_name || "D"
                    ).charAt(0).toUpperCase()}
                  </div>
                )}

                <div className="featured-dealership-info">
                  <h3>
                    {dealership.business_name || "Dealership"}
                  </h3>

                  <p>
                    {[
                      dealership.city,
                      dealership.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "Location not specified"}
                  </p>

                  {dealership.vehicle_type && (
                    <span className="featured-dealership-type">
                      {dealership.vehicle_type}
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </aside>
  );
}

export default FeaturedDealerships;
