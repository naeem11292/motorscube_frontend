
import {
  MapPin,
  Building2,
  Globe,
  MapPinned,
} from "lucide-react";

function LocationInformation({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <MapPin size={22} aria-hidden="true" />
        <span>Location Information</span>
      </h2>

      <div className="form-group">
        <label
          htmlFor="registration_city"
          className="add-sale-field-label"
        >
          <Building2 size={16} aria-hidden="true" />
          <span>Registration City</span>
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
        <label
          htmlFor="location"
          className="add-sale-field-label"
        >
          <MapPinned size={16} aria-hidden="true" />
          <span>Location</span>
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
        <label
          htmlFor="country"
          className="add-sale-field-label"
        >
          <Globe size={16} aria-hidden="true" />
          <span>Country</span>
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
