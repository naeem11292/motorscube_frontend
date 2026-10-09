function BikeFields({ formData, handleChange }) {
  return (
    <div className="hire-form-grid">
      <div className="hire-form-group">
        <label>Bike Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Standard, Sports"
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
        <label>Engine Size</label>
        <input
          type="text"
          name="engine_size"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="e.g. 125cc"
        />
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
          <option value="Electric">Electric</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Engine Type</label>
        <input
          type="text"
          name="engine_type"
          value={formData.engine_type}
          onChange={handleChange}
          placeholder="Enter engine type"
        />
      </div>

      <div className="hire-form-group">
        <label>Ignition</label>
        <input
          type="text"
          name="ignition"
          value={formData.ignition}
          onChange={handleChange}
          placeholder="e.g. Electric, Kick"
        />
      </div>

      <div className="hire-form-group">
        <label>Color</label>
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Enter bike color"
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

export default BikeFields;