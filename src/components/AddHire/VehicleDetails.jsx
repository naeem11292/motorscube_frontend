
const vehicleFields = {
  car: ["make", "model", "version", "year", "condition", "mileage", "price", "transmission", "fuel_type", "engine_size"],
  bike: ["make", "model", "version", "year", "condition", "mileage", "price", "engine_type"],
  commercial: ["make", "model", "year", "condition", "mileage", "price", "transmission", "fuel_type"],
  machinery: ["make", "model", "year", "condition", "hours_used", "price"],
  plant: ["plant_name", "model", "year", "condition", "hours_used", "price"],
};

const formatLabel = (field) =>
  field
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function VehicleDetails({ selectedType = "car" }) {
  const fields = vehicleFields[selectedType?.toLowerCase()] || vehicleFields.car;

  return (
    <section className="add-hire-section">
      <h2 className="add-hire-section-heading">Vehicle Details</h2>

      <div className="add-hire-fields-grid">
        {fields.map((field) => (
          <div className="form-group" key={field}>
            <label className="add-hire-field-label" htmlFor={`hire-${field}`}>
              {formatLabel(field)}
            </label>

            <input
              id={`hire-${field}`}
              name={field}
              type={["year", "mileage", "price", "hours_used", "engine_size"].includes(field) ? "number" : "text"}
              placeholder={`Enter ${formatLabel(field).toLowerCase()}`}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
