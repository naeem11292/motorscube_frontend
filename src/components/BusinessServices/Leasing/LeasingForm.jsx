
import { useEffect, useState } from "react";
import "./LeasingForm.css";

const initialFormData = {
  vehicle_type: "",
  name: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  leasing_description: "",
  leasing_featured_type: "basic",
  leasing_deals_in: "",
  post_status: "pending",
  ad_for: "leasing",
};

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const filename = path.split(/[\\/]/).pop();
  return `http://localhost:5000/uploads/${encodeURIComponent(filename)}`;
};

function LeasingForm({
  initialData = null,
  selectedVehicleType = "",
  onSubmit,
  disabled = false,
  onCancel,
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    if (initialData) {
      const populatedData = {};

      Object.keys(initialFormData).forEach((key) => {
        populatedData[key] =
          initialData[key] ?? initialFormData[key];
      });

      setFormData(populatedData);
    } else {
      setFormData({
        ...initialFormData,
        vehicle_type: selectedVehicleType,
      });
    }

    setImages([]);
    setMessage("");

    const fileInput = document.getElementById("leasing-images");
    if (fileInput) fileInput.value = "";
  }, [initialData, selectedVehicleType]);

  const existingImages = initialData
    ? Array.from({ length: 8 }, (_, index) =>
        initialData[`leasing_img${index + 1}`]
      ).filter(Boolean)
    : [];

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selected = Array.from(event.target.files || []);

    if (selected.length !== 0 && selected.length !== 8) {
      setImages([]);
      event.target.value = "";
      setMessage("Please select exactly 8 images.");
      setMessageType("error");
      return;
    }

    const invalidImage = selected.some(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidImage) {
      setImages([]);
      event.target.value = "";
      setMessage("Use JPG, PNG, or WEBP images only.");
      setMessageType("error");
      return;
    }

    setImages(selected);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || disabled) return;

    if (!formData.vehicle_type) {
      setMessage("Please select a vehicle type.");
      setMessageType("error");
      return;
    }

    if (!isEditing && images.length !== 8) {
      setMessage("Please select exactly 8 images.");
      setMessageType("error");
      return;
    }

    if (isEditing && images.length !== 0 && images.length !== 8) {
      setMessage(
        "Select exactly 8 replacement images, or leave images unchanged."
      );
      setMessageType("error");
      return;
    }

    if (!localStorage.getItem("motorscube_token")) {
      setMessage("Your session is missing. Please log in again.");
      setMessageType("error");
      return;
    }

    if (typeof onSubmit !== "function") {
      setMessage("Form submission is not configured.");
      setMessageType("error");
      return;
    }

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value ?? "");
    });

    images.forEach((file) => {
      payload.append("leasing_images", file);
    });

    setSubmitting(true);
    setMessage("");

    try {
      await onSubmit(payload);

      setMessage(
        isEditing
          ? "Leasing registration updated successfully."
          : "Leasing registration created successfully."
      );
      setMessageType("success");

      if (!isEditing) {
        setFormData({
          ...initialFormData,
          vehicle_type: selectedVehicleType,
        });

        setImages([]);

        const fileInput = document.getElementById("leasing-images");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error("LEASING SUBMISSION FAILED:", error);

      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to save leasing registration."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="leasing-form" onSubmit={handleSubmit}>
      <h3>
        {isEditing
          ? "Update Leasing Business Information"
          : "Leasing Business Information"}
      </h3>

      {message && (
        <p
          role="status"
          style={{
            color: messageType === "success" ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      <div className="leasing-form-grid">
        <label>
          Business Name *
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Vehicle Type *
          <select
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            required
            disabled={Boolean(selectedVehicleType) || isEditing}
          >
            <option value="">Select vehicle type</option>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="commercial">Commercial</option>
            <option value="machinery">Machinery</option>
            <option value="plant">Plant</option>
          </select>
        </label>

        <label>
          City *
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Country
          <input value="Pakistan" readOnly />
        </label>

        <label className="leasing-full-width">
          Address *
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone *
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email *
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Website *
          <input
            name="web"
            type="url"
            value={formData.web}
            onChange={handleChange}
            placeholder="https://example.com"
            required
          />
        </label>

        <label>
          Featured Plan *
          <select
            name="leasing_featured_type"
            value={formData.leasing_featured_type}
            onChange={handleChange}
            required
          >
            <option value="basic">Basic</option>
            <option value="medium">Medium</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>
        </label>

        <label>
          Leasing Services
          <input
            name="leasing_deals_in"
            value={formData.leasing_deals_in}
            onChange={handleChange}
          />
        </label>

        <label>
          Post Status *
          <select
            name="post_status"
            value={formData.post_status}
            onChange={handleChange}
            required
          >
            <option value="pending">Pending</option>
            <option value="active">Active</option>
          </select>
        </label>

        <label>
          Listing Type
          <input value="Leasing" readOnly />
        </label>

        <label className="leasing-full-width">
          Description *
          <textarea
            name="leasing_description"
            value={formData.leasing_description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        {isEditing && existingImages.length > 0 && (
          <div className="leasing-full-width">
            <p>Current Business Images</p>

            <div className="leasing-current-images">
              {existingImages.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt={`Leasing business ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "85px",
                    objectFit: "cover",
                    margin: "5px",
                    borderRadius: "6px",
                  }}
                />
              ))}
            </div>

            <small>
              Leave the image selection empty to keep existing images.
            </small>
          </div>
        )}

        <label className="leasing-full-width">
          Business Images {isEditing ? "(optional replacement)" : "(exactly 8)"} *
          <input
            id="leasing-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
            required={!isEditing}
          />
          <small>
            {images.length} replacement images selected
            {isEditing && " — select 8 to replace existing images"}
          </small>
        </label>
      </div>

      <button
        type="submit"
        className="leasing-submit-button"
        disabled={submitting || disabled}
      >
        {submitting || disabled
          ? "Saving..."
          : isEditing
            ? "Update Leasing Details"
            : "Submit Leasing Details"}
      </button>

      {isEditing && onCancel && (
        <button
          type="button"
          className="business-service-cancel-button"
          onClick={onCancel}
          disabled={submitting || disabled}
        >
          Cancel Editing
        </button>
      )}
    </form>
  );
}

export default LeasingForm;
