function CarFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Car Details</h2>

      <div className="form-group">
        <label htmlFor="car_doors">Doors</label>
        <input
          id="car_doors"
          name="doors"
          type="text"
          value={formData.doors}
          onChange={handleChange}
          placeholder="e.g. 4"
        />
      </div>

      <div className="form-group">
        <label htmlFor="car_body_type">Body Type</label>
        <select
          id="car_body_type"
          name="body_type"
          value={formData.body_type}
          onChange={handleChange}
        >
          <option value="">Select body type</option>
          <option value="sedan">Sedan</option>
          <option value="hatchback">Hatchback</option>
          <option value="suv">SUV</option>
          <option value="coupe">Coupe</option>
          <option value="convertible">Convertible</option>
          <option value="wagon">Wagon</option>
          <option value="van">Van</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="car_transmission">Transmission</label>
        <select
          id="car_transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
        >
          <option value="">Select transmission</option>
          <option value="manual">Manual</option>
          <option value="automatic">Automatic</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="car_fuel_type">Fuel Type</label>
        <select
          id="car_fuel_type"
          name="fuel_type"
          value={formData.fuel_type}
          onChange={handleChange}
        >
          <option value="">Select fuel type</option>
          <option value="petrol">Petrol</option>
          <option value="diesel">Diesel</option>
          <option value="hybrid">Hybrid</option>
          <option value="electric">Electric</option>
          <option value="cng">CNG</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="car_engine_size">Engine Size</label>
        <input
          id="car_engine_size"
          name="engine_size"
          type="number"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="e.g. 1300"
        />
      </div>
    </section>
  );
}

export default CarFields;