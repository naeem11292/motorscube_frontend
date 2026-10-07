function PlantFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Plant Details</h2>

      <div className="form-group">
        <label htmlFor="plant_name">Plant Name</label>
        <input
          id="plant_name"
          name="plant_name"
          type="text"
          value={formData.plant_name}
          onChange={handleChange}
          placeholder="Enter plant name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="parameter_type">Parameter Type</label>
        <input
          id="parameter_type"
          name="parameter_type"
          type="text"
          value={formData.parameter_type}
          onChange={handleChange}
          placeholder="Enter parameter type"
        />
      </div>

      <div className="form-group">
        <label htmlFor="plant_dimensions">Dimensions</label>
        <input
          id="plant_dimensions"
          name="dimensions"
          type="text"
          value={formData.dimensions}
          onChange={handleChange}
          placeholder="Enter dimensions"
        />
      </div>

      <div className="form-group">
        <label htmlFor="plant_weight">Weight</label>
        <input
          id="plant_weight"
          name="weight"
          type="text"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
        />
      </div>

      <div className="form-group">
        <label htmlFor="plant_serial_no">Serial Number</label>
        <input
          id="plant_serial_no"
          name="serial_no"
          type="number"
          value={formData.serial_no}
          onChange={handleChange}
          placeholder="Enter serial number"
        />
      </div>
    </section>
  );
}

export default PlantFields;