function LocationInformation({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Location Information</h2>

      <div className="form-group">
        <label htmlFor="registration_city">
          Registration City
        </label>

        <input
          id="registration_city"
          name="registration_city"
          type="text"
          value={formData.registration_city}
          onChange={handleChange}
          placeholder="Enter registration city"
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">
          Location
        </label>

        <input
          id="location"
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
        />
      </div>

      <div className="form-group">
        <label htmlFor="country">
          Country
        </label>

        <input
          id="country"
          name="country"
          type="text"
          value={formData.country}
          onChange={handleChange}
          placeholder="Enter country"
        />
      </div>
    </section>
  );
}

export default LocationInformation;