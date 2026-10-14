
import {
  Sprout,
  Factory,
  Settings2,
  Ruler,
  Weight,
  Hash,
  Clock3,
} from "lucide-react";

function PlantFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <Sprout size={22} aria-hidden="true" />
        <span>Plant Details</span>
      </h2>

      <div className="form-group">
        <label
          htmlFor="plant_name"
          className="add-sale-field-label"
        >
          <Factory size={16} aria-hidden="true" />
          <span>Plant Name</span>
        </label>
        <input
          id="plant_name"
          name="plant_name"
          type="text"
          value={formData.plant_name}
          onChange={handleChange}
          placeholder="Enter plant name"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="parameter_type"
          className="add-sale-field-label"
        >
          <Settings2 size={16} aria-hidden="true" />
          <span>Parameter Type</span>
        </label>
        <input
          id="parameter_type"
          name="parameter_type"
          type="text"
          value={formData.parameter_type}
          onChange={handleChange}
          placeholder="Enter parameter type"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="plant_dimensions"
          className="add-sale-field-label"
        >
          <Ruler size={16} aria-hidden="true" />
          <span>Dimensions</span>
        </label>
        <input
          id="plant_dimensions"
          name="dimensions"
          type="text"
          value={formData.dimensions}
          onChange={handleChange}
          placeholder="Enter dimensions"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="plant_weight"
          className="add-sale-field-label"
        >
          <Weight size={16} aria-hidden="true" />
          <span>Weight</span>
        </label>
        <input
          id="plant_weight"
          name="weight"
          type="text"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="plant_serial_no"
          className="add-sale-field-label"
        >
          <Hash size={16} aria-hidden="true" />
          <span>Serial Number</span>
        </label>
        <input
          id="plant_serial_no"
          name="serial_no"
          type="number"
          min="0"
          value={formData.serial_no}
          onChange={handleChange}
          placeholder="Enter serial number"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="plant_hours_used"
          className="add-sale-field-label"
        >
          <Clock3 size={16} aria-hidden="true" />
          <span>Hours Used</span>
        </label>
        <input
          id="plant_hours_used"
          name="hours_used"
          type="number"
          min="0"
          step="0.01"
          value={formData.hours_used}
          onChange={handleChange}
          placeholder="e.g. 1250"
        />
      </div>
    </section>
  );
}

export default PlantFields;
