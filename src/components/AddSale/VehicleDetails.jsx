function VehicleDetails({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Vehicle Details</h2>

      <div className="form-group">
        <label htmlFor="mileage">Mileage</label>
        <input
          id="mileage"
          name="mileage"
          type="number"
          value={formData.mileage}
          onChange={handleChange}
          placeholder="Enter mileage"
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          id="price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter price"
        />
      </div>

      <div className="form-group">
        <label htmlFor="body_type">Body Type</label>
        <input
          id="body_type"
          name="body_type"
          type="text"
          value={formData.body_type}
          onChange={handleChange}
          placeholder="Enter body type"
        />
      </div>

      <div className="form-group">
        <label htmlFor="color">Color</label>
        <input
          id="color"
          name="color"
          type="text"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter color"
        />
      </div>

      <div className="form-group">
        <label htmlFor="transmission">Transmission</label>
        <select
          id="transmission"
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
        <label htmlFor="fuel_type">Fuel Type</label>
        <select
          id="fuel_type"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
        >
          <option value="">Select fuel type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
          <option value="cng">CNG</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="engine_size">Engine Size</label>
        <input
          id="engine_size"
          name="engine_size"
          type="number"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="Enter engine size"
        />
      </div>

      <div className="form-group">
        <label htmlFor="doors">Doors</label>
        <input
          id="doors"
          name="doors"
          type="text"
          value={formData.doors}
          onChange={handleChange}
          placeholder="Enter number of doors"
        />
      </div>

      <div className="form-group">
        <label htmlFor="wheels_power">Wheels Power</label>
        <input
          id="wheels_power"
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

export default VehicleDetails;