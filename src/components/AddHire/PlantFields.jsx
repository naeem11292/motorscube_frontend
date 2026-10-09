function PlantFields({ formData, handleChange }) {
  return (
    <div className="hire-form-grid">
      <div className="hire-form-group">
        <label>Plant Name</label>
        <input
          type="text"
          name="plant_name"
          value={formData.plant_name}
          onChange={handleChange}
          placeholder="Enter plant name"
        />
      </div>

      <div className="hire-form-group">
        <label>Plant Type</label>
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Enter plant type"
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
        <label>Parameter Type</label>
        <input
          type="text"
          name="parameter_type"
          value={formData.parameter_type}
          onChange={handleChange}
          placeholder="Enter parameter type"
        />
      </div>

      <div className="hire-form-group">
        <label>Dimensions</label>
        <input
          type="text"
          name="dimensions"
          value={formData.dimensions}
          onChange={handleChange}
          placeholder="e.g. 20 × 30 ft"
        />
      </div>

      <div className="hire-form-group">
        <label>Weight</label>
        <input
          type="text"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
        />
      </div>

      <div className="hire-form-group">
        <label>Country</label>
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
        />
      </div>

      <div className="hire-form-group">
        <label>Hire Period (days)</label>
        <input
          type="number"
          min="0"
          name="hire_period"
          value={formData.hire_period}
          onChange={handleChange}
          placeholder="Enter hire period"
        />
      </div>

      <div className="hire-form-group">
        <label>Hours Used</label>
        <input
          type="text"
          name="hours_used"
          value={formData.hours_used}
          onChange={handleChange}
          placeholder="Enter hours used"
        />
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

export default PlantFields;