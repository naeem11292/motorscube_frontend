import { useEffect, useState } from "react";
import "./WorkshopForm.css";

const EMPTY_FORM = {
  vehicle_type: "",
  name: "",
  city: "",
  workshop_sector: "",
  sub_sector: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  category: "",
  service_1: "",
  service_2: "",
  service_3: "",
  service_4: "",
  workshop_time_from: "",
  workshop_time_to: "",
  workshop_description: "",
  workshop_featured_type: "basic",
  post_status: "pending",
  ad_for: "workshop",
};

const VEHICLE_TYPES = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "commercial", label: "Commercial" },
  { value: "machinery", label: "Machinery" },
  { value: "plant", label: "Plant" },
];

const IMAGE_COUNT = 8;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function WorkshopForm({
  initialData = null,
  selectedVehicleType = "",
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState({
    ...EMPTY_FORM,
    ...(initialData || {}),
    vehicle_type:
      initialData?.vehicle_type || selectedVehicleType || "",
  });

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!initialData) return;

    const savedImages = Array.from(
      { length: IMAGE_COUNT },
      (_, index) => initialData[`workshop_img${index + 1}`]
    ).filter(Boolean);

    setExistingImages(savedImages);
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const selected = Array.from(event.target.files || []);

    setError("");
    setSuccess("");

    if (!isEditing && selected.length !== IMAGE_COUNT) {
      setError("Please select exactly 8 images.");
      event.target.value = "";
      return;
    }

    if (isEditing && selected.length !== 0 &&
        selected.length !== IMAGE_COUNT) {
      setError("Select either no images or exactly 8 new images.");
      event.target.value = "";
      return;
    }

    for (const file of selected) {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setError("Only JPG, PNG, and WebP images are allowed.");
        event.target.value = "";
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        setError("Each image must be 5 MB or smaller.");
        event.target.value = "";
        return;
      }
    }

    setImages(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!localStorage.getItem("motorscube_token")) {
      setError("Please log in before submitting your workshop.");
      return;
    }

    if (!isEditing && images.length !== IMAGE_COUNT) {
      setError("Please upload exactly 8 workshop images.");
      return;
    }

    if (isEditing && images.length !== 0 &&
        images.length !== IMAGE_COUNT) {
      setError("Upload either 0 or exactly 8 images.");
      return;
    }

    const requiredFields = [
      "vehicle_type",
      "name",
      "city",
      "workshop_sector",
      "sub_sector",
      "address",
      "phone",
      "email",
      "web",
      "category",
      "service_1",
      "service_2",
      "service_3",
      "service_4",
      "workshop_time_from",
      "workshop_time_to",
      "workshop_description",
    ];

    const missingField = requiredFields.find(
      (field) => !String(formData[field] || "").trim()
    );

    if (missingField) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          payload.append(key, value);
        }
      });

      images.forEach((image) => {
        payload.append("workshop_images", image);
      });

      await onSubmit(payload);

      setSuccess(
        isEditing
          ? "Workshop updated successfully."
          : "Workshop submitted successfully."
      );
    } catch (err) {
      console.error("Workshop submission error:", err);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Unable to submit workshop. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workshop-form-wrapper">
      <div className="workshop-form-heading">
        <div>
          <span className="workshop-form-eyebrow">
            BUSINESS SERVICES
          </span>

          <h2>
            {isEditing ? "Update Workshop" : "Register Workshop"}
          </h2>

          <p>
            Add your workshop details and services to MotorsCube.
          </p>
        </div>
      </div>

      <form className="workshop-form" onSubmit={handleSubmit}>
        <div className="workshop-section">
          <h3>Business Information</h3>

          <div className="workshop-grid">
            <div className="workshop-field">
              <label>Business Name *</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter workshop name"
                required
              />
            </div>

            <div className="workshop-field">
              <label>Vehicle Type *</label>
              <select
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                disabled={Boolean(selectedVehicleType) || isEditing}
                required
              >
                <option value="">Select vehicle type</option>
                {VEHICLE_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="workshop-field">
              <label>City *</label>
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="workshop-field">
              <label>Workshop Sector *</label>
              <input
                name="workshop_sector"
                value={formData.workshop_sector}
                onChange={handleChange}
                placeholder="Enter workshop sector"
                required
              />
            </div>

            <div className="workshop-field">
              <label>Sub-sector *</label>
              <input
                name="sub_sector"
                value={formData.sub_sector}
                onChange={handleChange}
                placeholder="Enter sub-sector"
                required
              />
            </div>

            <div className="workshop-field">
              <label>Category *</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="Enter workshop category"
                required
              />
            </div>

            <div className="workshop-field workshop-field-full">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter complete workshop address"
                rows="3"
                required
              />
            </div>
          </div>
        </div>

        <div className="workshop-section">
          <h3>Contact Information</h3>

          <div className="workshop-grid">
            <div className="workshop-field">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="workshop-field">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="workshop-field workshop-field-full">
              <label>Website *</label>
              <input
                type="url"
                name="web"
                value={formData.web}
                onChange={handleChange}
                placeholder="https://example.com"
                required
              />
            </div>
          </div>
        </div>

        <div className="workshop-section">
          <h3>Workshop Services</h3>

          <div className="workshop-grid">
            {[1, 2, 3, 4].map((number) => (
              <div className="workshop-field" key={number}>
                <label>Service {number} *</label>
                <input
                  name={`service_${number}`}
                  value={formData[`service_${number}`]}
                  onChange={handleChange}
                  placeholder={`Enter service ${number}`}
                  required
                />
              </div>
            ))}
          </div>
        </div>

        <div className="workshop-section">
          <h3>Working Hours</h3>

          <div className="workshop-grid">
            <div className="workshop-field">
              <label>Opening Time *</label>
              <input
                type="time"
                name="workshop_time_from"
                value={formData.workshop_time_from}
                onChange={handleChange}
                required
              />
            </div>

            <div className="workshop-field">
              <label>Closing Time *</label>
              <input
                type="time"
                name="workshop_time_to"
                value={formData.workshop_time_to}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="workshop-section">
          <h3>Workshop Description</h3>

          <div className="workshop-field">
            <label>Description *</label>
            <textarea
              name="workshop_description"
              value={formData.workshop_description}
              onChange={handleChange}
              placeholder="Describe your workshop and the services you provide"
              rows="5"
              required
            />
          </div>
        </div>

        <div className="workshop-section">
          <h3>Workshop Images</h3>

          <p className="workshop-image-help">
            {isEditing
              ? "Select 8 new images to replace the existing images, or leave empty to keep them."
              : "Upload exactly 8 images. JPG, PNG, or WebP; maximum 5 MB each."}
          </p>

          {isEditing && existingImages.length > 0 && (
            <div className="workshop-image-preview">
              {existingImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`Workshop ${index + 1}`}
                />
              ))}
            </div>
          )}

          <div className="workshop-field">
            <label>
              {isEditing ? "Replace Images" : "Upload 8 Images"}
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleImageChange}
              required={!isEditing}
            />

            {images.length > 0 && (
              <p className="workshop-image-help">
                {images.length} new images selected.
              </p>
            )}

            {images.length > 0 && (
              <div className="workshop-image-preview">
                {images.map((image, index) => (
                  <img
                    key={`${image.name}-${index}`}
                    src={URL.createObjectURL(image)}
                    alt={`New workshop image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="workshop-section">
          <h3>Listing Settings</h3>

          <div className="workshop-grid">
            <div className="workshop-field">
              <label>Featured Plan</label>
              <select
                name="workshop_featured_type"
                value={formData.workshop_featured_type}
                onChange={handleChange}
              >
                <option value="basic">Basic</option>
                <option value="featured">Featured</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div className="workshop-field">
              <label>Post Status</label>
              <select
                name="post_status"
                value={formData.post_status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="workshop-message workshop-error">
            {error}
          </div>
        )}

        {success && (
          <div className="workshop-message workshop-success">
            {success}
          </div>
        )}

        <div className="workshop-form-actions">
          <button
            type="button"
            className="workshop-cancel-btn"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="workshop-submit-btn"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isEditing
                ? "Update Workshop"
                : "Submit Workshop"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkshopForm;