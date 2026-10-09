function CarFields({ formData, handleChange }) {
  return (
    <div className="hire-form-grid">
      <div className="hire-form-group">
        <label>Body Type</label>
        <input
          name="body_type"
          value={formData.body_type}
          onChange={handleChange}
          placeholder="e.g. Sedan, SUV"
        />
      </div>

      <div className="hire-form-group">
        <label>Transmission</label>
        <select
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
        >
          <option value="">Select transmission</option>
          <option value="Automatic">Automatic</option>
          <option value="Manual">Manual</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Fuel Type</label>
        <select
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
        >
          <option value="">Select fuel type</option>
          <option value="Petrol">Petrol</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Electric">Electric</option>
          <option value="CNG">CNG</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Engine Size</label>
        <input
          name="engine_size"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="e.g. 1800cc"
        />
      </div>

      <div className="hire-form-group">
        <label>Doors</label>
        <select
          name="doors"
          value={formData.doors}
          onChange={handleChange}
        >
          <option value="">Select doors</option>
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Color</label>
        <input
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter color"
        />
      </div>

      <div className="hire-form-group">
        <label>Mileage (km)</label>
        <input
          type="number"
          min="0"
          name="mileage"
          value={formData.mileage}
          onChange={handleChange}
          placeholder="Enter mileage"
        />
      </div>

      <div className="hire-form-group">
        <label>Driver Included?</label>
        <select
          name="driver"
          value={formData.driver}
          onChange={handleChange}
        >
          <option value="">Select option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </div>
    </div>
  );
}

export default CarFields;