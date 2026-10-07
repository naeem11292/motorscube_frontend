function MachineryFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Machinery Details</h2>

      <div className="form-group">
        <label htmlFor="machinery_type">Machinery Type</label>
        <input
          id="machinery_type"
          name="type"
          type="text"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Excavator, Loader"
        />
      </div>

      <div className="form-group">
        <label htmlFor="machinery_subtype">Machinery Subtype</label>
        <input
          id="machinery_subtype"
          name="subtype"
          type="text"
          value={formData.subtype}
          onChange={handleChange}
          placeholder="Enter subtype"
        />
      </div>

      <div className="form-group">
        <label htmlFor="machinery_condition">Condition</label>
        <select
          id="machinery_condition"
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
        <label htmlFor="machinery_make">Make</label>
        <input
          id="machinery_make"
          name="make"
          type="text"
          value={formData.make}
          onChange={handleChange}
          placeholder="Enter make"
        />
      </div>

      <div className="form-group">
        <label htmlFor="machinery_model">Model</label>
        <input
          id="machinery_model"
          name="model"
          type="text"
          value={formData.model}
          onChange={handleChange}
          placeholder="Enter model"
        />
      </div>

      <div className="form-group">
        <label htmlFor="machinery_year">Year</label>
        <input
          id="machinery_year"
          name="year"
          type="number"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter year"
        />
      </div>

      <div className="form-group">
        <label htmlFor="machinery_weight">Weight</label>
        <input
          id="machinery_weight"
          name="weight"
          type="text"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
        />
      </div>

      <div className="form-group">
        <label htmlFor="machinery_dimensions">Dimensions</label>
        <input
          id="machinery_dimensions"
          name="dimensions"
          type="text"
          value={formData.dimensions}
          onChange={handleChange}
          placeholder="Enter dimensions"
        />
      </div>
    </section>
  );
}

export default MachineryFields;