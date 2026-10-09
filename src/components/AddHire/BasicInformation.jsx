function BasicInformation({ formData, handleChange, vehicleType }) {
  return (
    <section className="hire-form-section">
      <h2>Basic Information</h2>

      <div className="hire-form-grid">
        <div className="hire-form-group">
          <label>Ad Type</label>
          <select
            name="ad_type"
            value={formData.ad_type}
            onChange={handleChange}
          >
            <option value="">Select ad type</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
            <option value="dealer">Dealer</option>
          </select>
        </div>

        <div className="hire-form-group">
          <label>Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
          </select>
        </div>

        {vehicleType !== "plant" && (
          <>
            <div className="hire-form-group">
              <label>Make</label>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="e.g. Toyota"
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
              <label>Version</label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                placeholder="Enter version"
              />
            </div>

            <div className="hire-form-group">
              <label>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="0"
                placeholder="e.g. 2024"
              />
            </div>
          </>
        )}

        <div className="hire-form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter city or location"
          />
        </div>

        <div className="hire-form-group">
          <label>Registration City</label>
          <input
            type="text"
            name="registration_city"
            value={formData.registration_city}
            onChange={handleChange}
            placeholder="Enter registration city"
          />
        </div>
      </div>
    </section>
  );
}

export default BasicInformation;