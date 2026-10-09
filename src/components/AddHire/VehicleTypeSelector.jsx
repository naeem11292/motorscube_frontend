import "./VehicleTypeSelector.css";

const vehicleTypes = [
  { value: "car", label: "Cars", icon: "🚗" },
  { value: "bike", label: "Bikes", icon: "🏍️" },
  { value: "commercial", label: "Commercial", icon: "🚚" },
  { value: "machinery", label: "Machinery", icon: "🏗️" },
  { value: "plant", label: "Plant", icon: "🚜" },
];

function VehicleTypeSelector({ vehicleType, setVehicleType }) {
  return (
    <div className="hire-vehicle-grid">
      {vehicleTypes.map((vehicle) => (
        <button
          key={vehicle.value}
          type="button"
          className={`hire-vehicle-card ${
            vehicleType === vehicle.value ? "active" : ""
          }`}
          onClick={() => setVehicleType(vehicle.value)}
        >
          <span className="hire-vehicle-icon">{vehicle.icon}</span>
          <span className="hire-vehicle-label">{vehicle.label}</span>
        </button>
      ))}
    </div>
  );
}

export default VehicleTypeSelector;