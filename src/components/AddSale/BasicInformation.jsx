function BasicInformation({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Basic Information</h2>

      <div className="form-group">
        <label htmlFor="type">Type</label>
        <input
          id="type"
          name="type"
          type="text"
          value={formData.type}
          onChange={handleChange}
          placeholder="Enter type"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subtype">Subtype</label>
        <input
          id="subtype"
          name="subtype"
          type="text"
          value={formData.subtype}
          onChange={handleChange}
          placeholder="Enter subtype"
        />
      </div>

      <div className="form-group">
        <label htmlFor="condition">Condition</label>
        <select
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
        >
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="make">Make</label>
        <input
          id="make"
          name="make"
          type="text"
          value={formData.make}
          onChange={handleChange}
          placeholder="Enter make"
        />
      </div>

      <div className="form-group">
        <label htmlFor="model">Model</label>
        <input
          id="model"
          name="model"
          type="text"
          value={formData.model}
          onChange={handleChange}
          placeholder="Enter model"
        />
      </div>

      <div className="form-group">
        <label htmlFor="version">Version</label>
        <input
          id="version"
          name="version"
          type="text"
          value={formData.version}
          onChange={handleChange}
          placeholder="Enter version"
        />
      </div>

      <div className="form-group">
        <label htmlFor="year">Year</label>
        <input
          id="year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter year"
        />
      </div>
    </section>
  );
}

export default BasicInformation;