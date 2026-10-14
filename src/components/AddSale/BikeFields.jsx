
import {
  Bike,
  Palette,
  Gauge,
  Cog,
  Settings2,
  Fuel,
  CircleGauge,
} from "lucide-react";

function BikeFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <Bike size={22} aria-hidden="true" />
        <span>Bike Details</span>
      </h2>

      <div className="form-group">
        <label htmlFor="bike_color" className="add-sale-field-label">
          <Palette size={16} aria-hidden="true" />
          <span>Color</span>
        </label>
        <input
          id="bike_color"
          name="color"
          type="text"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter color"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="bike_engine_size"
          className="add-sale-field-label"
        >
          <Gauge size={16} aria-hidden="true" />
          <span>Engine Size (cc)</span>
        </label>
        <input
          id="bike_engine_size"
          name="engine_size"
          type="number"
          min="0"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="e.g. 70, 125, 150"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="bike_engine_type"
          className="add-sale-field-label"
        >
          <Cog size={16} aria-hidden="true" />
          <span>Engine Type</span>
        </label>
        <select
          id="bike_engine_type"
          name="engine_type"
          value={formData.engine_type}
          onChange={handleChange}
        >
          <option value="">Select engine type</option>
          <option value="2-stroke">2-Stroke</option>
          <option value="4-stroke">4-Stroke</option>
          <option value="electric">Electric Motor</option>
        </select>
      </div>

      <div className="form-group">
        <label
          htmlFor="bike_transmission"
          className="add-sale-field-label"
        >
          <Settings2 size={16} aria-hidden="true" />
          <span>Transmission</span>
        </label>
        <select
          id="bike_transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
        >
          <option value="">Select transmission</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      <div className="form-group">
        <label
          htmlFor="bike_fuel_type"
          className="add-sale-field-label"
        >
          <Fuel size={16} aria-hidden="true" />
          <span>Fuel Type</span>
        </label>
        <select
          id="bike_fuel_type"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
        >
          <option value="">Select fuel type</option>
          <option value="petrol">Petrol</option>
          <option value="electric">Electric</option>
        </select>
      </div>

      <div className="form-group">
        <label
          htmlFor="bike_wheels_power"
          className="add-sale-field-label"
        >
          <CircleGauge size={16} aria-hidden="true" />
          <span>Wheels Power</span>
        </label>
        <input
          id="bike_wheels_power"
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

export default BikeFields;