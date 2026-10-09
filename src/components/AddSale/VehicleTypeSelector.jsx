import "./VehicleTypeSelector.css";

const vehicleTypes = [
  { value: "car", icon: "🚗", label: "Car" },
  { value: "bike", icon: "🏍️", label: "Bike" },
  { value: "commercial", icon: "🚚", label: "Commercial" },
  { value: "machinery", icon: "⚙️", label: "Machinery" },
  { value: "plant", icon: "🏗️", label: "Plant" },
];

function VehicleTypeSelector({ value, onChange }) {
  return (
    <section className="sale-vehicle-section">
      <h2>What do you want to sell?</h2>

      <p className="sale-vehicle-subtitle">
        Select a vehicle category to continue.
      </p>

      <div className="sale-vehicle-grid">
        {vehicleTypes.map((vehicle) => (
          <button
            key={vehicle.value}
            type="button"
            className={`sale-vehicle-card ${
              value === vehicle.value ? "active" : ""
            }`}
            onClick={() =>
              onChange({
                target: {
                  name: "vehicle_type",
                  value: vehicle.value,
                },
              })
            }
            aria-pressed={value === vehicle.value}
          >
            <span className="sale-vehicle-icon">
              {vehicle.icon}
            </span>

            <span className="sale-vehicle-label">
              {vehicle.label}
            </span>

            {value === vehicle.value && (
              <span className="sale-vehicle-check">✓</span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}

export default VehicleTypeSelector;