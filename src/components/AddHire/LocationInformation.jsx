function LocationInformation({ formData, handleChange, vehicleType }) {
  return (
    <section className="hire-form-section">
      <h2>Location Information</h2>

      <div className="hire-form-grid">
        <div className="hire-form-group">
          <label>City / Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your city or location"
            required
          />
        </div>

        {(vehicleType === "machinery" || vehicleType === "plant") && (
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
        )}

        {["car", "bike", "commercial"].includes(vehicleType) && (
          <div className="hire-form-group">
            <label>Registration City</label>
            <input
              type="text"
              name="registration_city"
              value={formData.registration_city}
              onChange={handleChange}
              placeholder="e.g. Lahore"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default LocationInformation;