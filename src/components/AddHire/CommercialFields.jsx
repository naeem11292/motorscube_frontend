
import {
  Truck,
  CarFront,
  Palette,
  Fuel,
  Gauge,
  CircleGauge,
} from "lucide-react";

function CommercialFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <Truck size={22} aria-hidden="true" />
        <span>Commercial Vehicle Details</span>
      </h2>

      <div className="form-group">
        <label
          htmlFor="commercial_body_type"
          className="add-sale-field-label"
        >
          <CarFront size={16} aria-hidden="true" />
          <span>Body Type</span>
        </label>
        <input
          id="commercial_body_type"
          name="body_type"
          type="text"
          value={formData.body_type}
          onChange={handleChange}
          placeholder="e.g. Car,Bike"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="commercial_color"
          className="add-sale-field-label"
        >
          <Palette size={16} aria-hidden="true" />
          <span>Color</span>
        </label>
        <input
          id="commercial_color"
          name="color"
          type="text"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter color"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="commercial_fuel_type"
          className="add-sale-field-label"
        >
          <Fuel size={16} aria-hidden="true" />
          <span>Fuel Type</span>
        </label>
        <select
          id="commercial_fuel_type"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
        >
          <option value="">Select fuel type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="cng">CNG</option>
          <option value="electric">Electric</option>
          <option value="hybrid">Hybrid</option>
        </select>
      </div>

      <div className="form-group">
        <label
          htmlFor="commercial_engine_size"
          className="add-sale-field-label"
        >
          <Gauge size={16} aria-hidden="true" />
          <span>Engine Size</span>
        </label>
        <input
          id="commercial_engine_size"
          name="engine_size"
          type="number"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="Enter engine size"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="commercial_wheels_power"
          className="add-sale-field-label"
        >
          <CircleGauge size={16} aria-hidden="true" />
          <span>Wheels Power</span>
        </label>
        <input
          id="commercial_wheels_power"
          name="wheels_power"
          type="text"
          value={formData.wheels_power}
          onChange={handleChange}
          placeholder="Enter wheels power"
        />
      </div>
    </section>
  );
}

export default CommercialFields;
