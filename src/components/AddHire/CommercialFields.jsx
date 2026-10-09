function CommercialFields({ formData, handleChange }) {
  return (
    <div className="hire-form-grid">
      <div className="hire-form-group">
        <label>Vehicle Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Truck, Van, Pickup"
        />
      </div>

      <div className="hire-form-group">
        <label>Subtype</label>
        <input
          type="text"
          name="subtype"
          value={formData.subtype}
          onChange={handleChange}
          placeholder="Enter subtype"
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
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
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
          <option value="Diesel">Diesel</option>
          <option value="Petrol">Petrol</option>
          <option value="CNG">CNG</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Engine Size</label>
        <input
          type="text"
          name="engine_size"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="Enter engine size"
        />
      </div>

      <div className="hire-form-group">
        <label>Wheels / Power</label>
        <input
          type="text"
          name="wheels_power"
          value={formData.wheels_power}
          onChange={handleChange}
          placeholder="e.g. 6 wheels, 200 HP"
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

export default CommercialFields;