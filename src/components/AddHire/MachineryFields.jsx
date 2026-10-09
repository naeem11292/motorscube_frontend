function MachineryFields({ formData, handleChange }) {
  return (
    <div className="hire-form-grid">
      <div className="hire-form-group">
        <label>Machinery Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Excavator, Crane"
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
        <label>Make</label>
        <input
          type="text"
          name="make"
          value={formData.make}
          onChange={handleChange}
          placeholder="Enter manufacturer"
        />
      </div>

      <div className="hire-form-group">
        <label>Model</label>
        <input
          type="text"
          name="model"
          value={formData.model}
          onChange={handleChange}
          placeholder="Enter model"
        />
      </div>

      <div className="hire-form-group">
        <label>Year</label>
        <input
          type="number"
          min="0"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter manufacturing year"
        />
      </div>

      <div className="hire-form-group">
        <label>Serial Number</label>
        <input
          type="number"
          min="0"
          name="serial_no"
          value={formData.serial_no}
          onChange={handleChange}
          placeholder="Enter serial number"
        />
      </div>

      <div className="hire-form-group">
        <label>Weight</label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="e.g. 5 tons"
        />
      </div>

      <div className="hire-form-group">
        <label>Hours Used</label>
        <input
          type="text"
          name="hours_used"
          value={formData.hours_used}
          onChange={handleChange}
          placeholder="e.g. 1200 hours"
        />
      </div>

      <div className="hire-form-group">
        <label>Fuel Type</label>
        <input
          type="text"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
          placeholder="Enter fuel type"
        />
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
        <label>Driver / Operator Included?</label>
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

      <div className="hire-form-group">
        <label>Installation Service</label>
        <select
          name="installation_service"
          value={formData.installation_service}
          onChange={handleChange}
        >
          <option value="">Select option</option>
          <option value="yes">Available</option>
          <option value="no">Not available</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Maintenance / Repair</label>
        <select
          name="maintenance_repair"
          value={formData.maintenance_repair}
          onChange={handleChange}
        >
          <option value="">Select option</option>
          <option value="yes">Available</option>
          <option value="no">Not available</option>
        </select>
      </div>

      <div className="hire-form-group">
        <label>Regular Maintenance</label>
        <select
          name="regular_maintenance"
          value={formData.regular_maintenance}
          onChange={handleChange}
        >
          <option value="">Select option</option>
          <option value="yes">Included</option>
          <option value="no">Not included</option>
        </select>
      </div>
    </div>
  );
}

export default MachineryFields;