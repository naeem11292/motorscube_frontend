function VehicleTypeSelector({ value, onChange }) {
  return (
    <div>
      <label htmlFor="vehicle_type">
        Vehicle Type
      </label>

      <select
        id="vehicle_type"
        name="vehicle_type"
        value={value}
        onChange={onChange}
      >
        <option value="">
          Select Vehicle Type
        </option>

        <option value="car">
          Car
        </option>

        <option value="bike">
          Bike
        </option>

        <option value="commercial">
          Commercial
        </option>

        <option value="machinery">
          Machinery
        </option>

        <option value="plant">
          Plant
        </option>
      </select>
    </div>
  );
}

export default VehicleTypeSelector;