
import "./VehicleTypeSelector.css";

const vehicleTypes = [
  { value: "car", label: "Car", icon: "🚗" },
  { value: "bike", label: "Bike", icon: "🏍️" },
  { value: "commercial", label: "Commercial", icon: "🚚" },
  { value: "machinery", label: "Machinery", icon: "⚙️" },
  { value: "plant", label: "Plant", icon: "🏗️" },
];

function VehicleTypeSelector({ value, onChange }) {
  return (
    <section className="hire-section">
      <h2>Vehicle Type</h2>
      <p className="hire-section-description">
        Select the type of vehicle or equipment you want to hire out.
      </p>

      <div className="hire-vehicle-types">
        {vehicleTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            className={`hire-vehicle-option ${
              value === type.value ? "selected" : ""
            }`}
            onClick={() => onChange(type.value)}
            aria-pressed={value === type.value}
          >
            <span className="hire-vehicle-icon">{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default VehicleTypeSelector;
