function BikeFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Bike Details</h2>

      <div className="form-group">
        <label htmlFor="bike_color">Color</label>
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
        <label htmlFor="bike_engine_size">Engine Size</label>
        <input
          id="bike_engine_size"
          name="engine_size"
          type="number"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="Enter engine size"
        />
      </div>

      <div className="form-group">
        <label htmlFor="bike_transmission">Transmission</label>
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
        <label htmlFor="bike_fuel_type">Fuel Type</label>
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
        <label htmlFor="bike_wheels_power">Wheels Power</label>
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