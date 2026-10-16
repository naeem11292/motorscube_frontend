
import {
  DoorOpen,
  CarFront,
  Gauge,
  Fuel,
  Settings2,
} from "lucide-react";

function CarFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <CarFront size={22} aria-hidden="true" />
        <span>Car Details</span>
      </h2>

      <div className="form-group">
        <label htmlFor="car_doors" className="add-sale-field-label">
          <DoorOpen size={16} aria-hidden="true" />
          <span>Doors</span>
        </label>

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
        <label htmlFor="car_body_type" className="add-sale-field-label">
          <CarFront size={16} aria-hidden="true" />
          <span>Body Type</span>
        </label>

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
        <label htmlFor="car_transmission" className="add-sale-field-label">
          <Settings2 size={16} aria-hidden="true" />
          <span>Transmission</span>
        </label>

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
        <label htmlFor="car_fuel_type" className="add-sale-field-label">
          <Fuel size={16} aria-hidden="true" />
          <span>Fuel Type</span>
        </label>

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
        <label htmlFor="car_engine_size" className="add-sale-field-label">
          <Gauge size={16} aria-hidden="true" />
          <span>Engine Size (cc)</span>
        </label>

        <input
          id="car_engine_size"
          name="engine_size"
          type="number"
          min="0"
          value={formData.engine_size}
          onChange={handleChange}
          placeholder="e.g. 1300"
        />
      </div>
    </section>
  );
}

export default CarFields;
