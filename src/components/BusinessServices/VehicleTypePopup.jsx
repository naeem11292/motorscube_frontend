
import { useEffect, useState } from "react";
import { getDealerships } from "../../api/dealership.api";
import { getInsuranceListings } from "../../api/insurance.api";
import { getLeasingListings } from "../../api/leasing.api";
import "./VehicleTypePopup.css";

const VEHICLE_TYPES = [
  { value: "car", label: "Car", icon: "🚗" },
  { value: "bike", label: "Bike", icon: "🏍️" },
  { value: "commercial", label: "Commercial", icon: "🚚" },
  { value: "machinery", label: "Machinery", icon: "⚙️" },
  { value: "plant", label: "Plant", icon: "🏗️" },
];

const SERVICE_CONFIG = {
  dealership: {
    title: "Dealership",
    fetch: getDealerships,
  },
  insurance: {
    title: "Insurance",
    fetch: getInsuranceListings,
  },
  leasing: {
    title: "Leasing",
    fetch: getLeasingListings,
  },
};

function VehicleTypePopup({
  category,
  onSelect,
  onClose,
}) {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const service = SERVICE_CONFIG[category];

  useEffect(() => {
    let mounted = true;

    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        setError("");

        if (!service) {
          throw new Error("Unsupported business service.");
        }

        const response = await service.fetch();
        const data = response?.data?.data ?? response?.data ?? response;

        if (mounted) {
          setRegistrations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch registrations:", err);

        if (mounted) {
          setError(
            err?.response?.data?.message ||
            "Unable to load your registrations. Please try again."
          );
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchRegistrations();

    return () => {
      mounted = false;
    };
  }, [category]);

  const handleSelect = (vehicleType) => {
    const existing = registrations.find(
      (item) => item.vehicle_type === vehicleType
    );

    onSelect({
      vehicleType,
      registration: existing || null,
    });
  };

  if (!service) return null;

  return (
    <div
      className="vehicle-popup-overlay"
      onClick={onClose}
    >
      <section
        className="vehicle-popup"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vehicle-popup-title"
      >
        <button
          type="button"
          className="vehicle-popup-close"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>

        <h2 id="vehicle-popup-title">
          {service.title} Registration
        </h2>

        <p className="vehicle-popup-description">
          Select the vehicle type you want to manage or register.
        </p>

        {loading && (
          <p className="vehicle-popup-status">
            Loading your registrations...
          </p>
        )}

        {error && (
          <div className="vehicle-popup-error">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="vehicle-popup-grid">
              {VEHICLE_TYPES.map((type) => {
                const registered = registrations.some(
                  (item) => item.vehicle_type === type.value
                );

                return (
                  <button
                    key={type.value}
                    type="button"
                    className={`vehicle-popup-card ${
                      registered ? "registered" : "available"
                    }`}
                    onClick={() => handleSelect(type.value)}
                  >
                    <span className="vehicle-popup-icon">
                      {type.icon}
                    </span>

                    <strong>{type.label}</strong>

                    <span className="vehicle-popup-card-status">
                      {registered
                        ? "Registered · Manage"
                        : "Not registered · Add"}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="vehicle-popup-legend">
              <span>
                <i className="legend-blue" />
                Registered
              </span>
              <span>
                <i className="legend-grey" />
                Available
              </span>
            </div>
          </>
        )}

        <button
          type="button"
          className="vehicle-popup-cancel"
          onClick={onClose}
        >
          Cancel
        </button>
      </section>
    </div>
  );
}

export default VehicleTypePopup;
