function Description({ formData, handleChange }) {
  return (
    <section className="hire-form-section">
      <h2>Hire Charges & Description</h2>

      <div className="hire-form-grid">
        <div className="hire-form-group">
          <label>Hire Charges (PKR) *</label>
          <input
            type="number"
            name="charges"
            value={formData.charges}
            onChange={handleChange}
            min="0"
            placeholder="Enter hire charges"
            required
          />
        </div>

        <div className="hire-form-group">
          <label>Charging Period *</label>
          <select
            name="charges_type"
            value={formData.charges_type}
            onChange={handleChange}
            required
          >
            <option value="">Select charging period</option>
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div className="hire-form-group hire-description-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            placeholder="Describe the vehicle or equipment, hire terms, and included services..."
          />
        </div>
      </div>
    </section>
  );
}

export default Description;