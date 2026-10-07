function CommercialFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Commercial Vehicle Details</h2>

      <div className="form-group">
        <label htmlFor="commercial_body_type">Body Type</label>
        <input
          id="commercial_body_type"
          name="body_type"
          type="text"
          value={formData.body_type}
          onChange={handleChange}
          placeholder="e.g. Truck, Bus, Van"
        />
      </div>

      <div className="form-group">
        <label htmlFor="commercial_color">Color</label>
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
        <label htmlFor="commercial_fuel_type">Fuel Type</label>
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
        <label htmlFor="commercial_engine_size">Engine Size</label>
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
        <label htmlFor="commercial_wheels_power">Wheels Power</label>
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