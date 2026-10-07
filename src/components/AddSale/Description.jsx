function Description({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Description</h2>

      <div className="form-group">
        <label htmlFor="description">Description</label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the vehicle you want to sell"
          rows="6"
        />
      </div>
    </section>
  );
}

export default Description;