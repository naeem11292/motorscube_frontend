
function CarFields({ formData, handleChange }) {
  return (
    <section className="add-hire-section">
      <h2>Car Details</h2>

      <div className="form-group">
        <label htmlFor="car_doors">Doors</label>
        <select
          id="car_doors"
          name="doors"
          value={formData.doors}
          onChange={handleChange}
        >
          <option value="">Select number of doors</option>
          <option value="2">2 Doors</option>
          <option value="3">3 Doors</option>
          <option value="4">4 Doors</option>
          <option value="5">5 Doors</option>
        </select>
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
        <label htmlFor="car_engine_size">Engine Size (cc)</label>
        <input
          id="car_engine_size"
          name="engine_size"
          type="number"
          min="0"
          step="1"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="e.g. 1300"
        />
      </div>
    </section>
  );
}

export default CarFields;
