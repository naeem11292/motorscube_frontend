
import { useEffect, useState } from "react";
import "./DealershipForm.css";

const VEHICLE_TYPES = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "commercial", label: "Commercial" },
  { value: "machinery", label: "Machinery" },
  { value: "plant", label: "Plant" },
];

const INITIAL_FORM = {
  vehicle_type: "",
  business_name: "",
  country: "Pakistan",
  city: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  dealership_time_from: "",
  dealership_time_in: "",
  description: "",
  dealership_featured_type: "",
  dealership_deals_in: "",
  post_status: "active",
  ad_for: "sale",
};

const IMAGE_FIELDS = Array.from(
  { length: 8 },
  (_, index) => `dealership_img${index + 1}`
);

function DealershipForm({
  initialData = null,
  selectedVehicleType = "",
  onSubmit,
  onCancel,
  disabled = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      const populated = { ...INITIAL_FORM };

      Object.keys(populated).forEach((key) => {
        populated[key] = initialData[key] ?? populated[key];
      });

      setFormData(populated);
    } else {
      setFormData({
        ...INITIAL_FORM,
        vehicle_type: selectedVehicleType || "",
      });
    }

    setImages([]);
    setError("");
    if (!formData.vehicle_type) {
  setError("Please select a vehicle type.");
  return;
}
  }, [initialData, selectedVehicleType]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selected = Array.from(event.target.files || []);

    if (selected.length > 8) {
      setError("You can upload a maximum of 8 images.");
      event.target.value = "";
      setImages([]);
      return;
    }

    setError("");
    setImages(selected);
  };

  const getExistingImages = () => {
    if (!initialData) return [];

    return IMAGE_FIELDS
      .map((field) => initialData[field])
      .filter(Boolean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!isEditing && images.length === 0) {
      setError("Please upload at least one dealership image.");
      return;
    }

    if (images.length > 8) {
      setError("You can upload a maximum of 8 images.");
      return;
    }

    

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value ?? "");
    });

    images.forEach((image) => {
      payload.append("dealership_images", image);
    });

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to save dealership."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="dealership-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? "Edit Dealership" : "Register Dealership"}</h2>

      {error && <p className="form-error">{error}</p>}

      <div className="dealership-form-grid">
        <div className="form-group">
          <label>Vehicle Type *</label>
          <select
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            required
            disabled={disabled || isEditing}
          >
            <option value="">Select vehicle type</option>
            {VEHICLE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Business Name *</label>
          <input
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Country *</label>
          <input
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>City *</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Address *</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Website *</label>
          <input
            type="text"
            name="web"
            value={formData.web}
            onChange={handleChange}
            placeholder="https://example.com"
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Opening Time *</label>
          <input
            type="time"
            name="dealership_time_from"
            value={formData.dealership_time_from}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Closing Time *</label>
          <input
            type="time"
            name="dealership_time_in"
            value={formData.dealership_time_in}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Featured Type *</label>
          <input
            name="dealership_featured_type"
            value={formData.dealership_featured_type}
            onChange={handleChange}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Deals In</label>
          <input
            name="dealership_deals_in"
            value={formData.dealership_deals_in}
            onChange={handleChange}
            disabled={disabled}
          />
        </div>

        <div className="form-group">
          <label>Post Status *</label>
          <select
            name="post_status"
            value={formData.post_status}
            onChange={handleChange}
            required
            disabled={disabled}
          >
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ad For *</label>
          <select
            name="ad_for"
            value={formData.ad_for}
            onChange={handleChange}
            required
            disabled={disabled}
          >
            <option value="sale">Sale</option>
            <option value="rent">Rent</option>
            <option value="both">Both</option>
          </select>
        </div>

        <div className="form-group full-width">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
            disabled={disabled}
          />
        </div>

        <div className="form-group full-width">
          <label>
            Dealership Images * {!isEditing && "(At least 1, maximum 8)"}
          </label>

          {isEditing && getExistingImages().length > 0 && (
            <p>
              {getExistingImages().length} existing image(s).
              Upload replacement images if required.
            </p>
          )}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            disabled={disabled}
          />

          {images.length > 0 && (
            <p>{images.length} new image(s) selected.</p>
          )}
        </div>
      </div>

      <div className="dealership-form-actions">
        <button
          type="submit"
          disabled={disabled || submitting}
        >
          {submitting
            ? "Saving..."
            : isEditing
              ? "Update Dealership"
              : "Register Dealership"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled || submitting}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default DealershipForm;
