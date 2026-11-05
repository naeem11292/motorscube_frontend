
import { useEffect, useState } from "react";
import "./InsuranceForm.css";

const initialFormData = {
  vehicle_type: "",
  name: "",
  cover: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  insurance_description: "",
  insurance_featured_type: "basic",
  insurance_deals_in: "",
  post_status: "pending",
  ad_for: "insurance",
};

const imageFields = [
  "insurance_img1",
  "insurance_img2",
  "insurance_img3",
  "insurance_img4",
  "insurance_img5",
  "insurance_img6",
  "insurance_img7",
  "insurance_img8",
];

const getImageUrl = (path) => {
  if (!path) return "";

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const filename = path.split(/[\\/]/).pop();

  return `http://localhost:5000/uploads/${encodeURIComponent(filename)}`;
};

function InsuranceForm({
  initialData = null,
  selectedVehicleType = "",
  onSubmit,
  onCancel,
  disabled = false,
}) {
  const isEditing = Boolean(initialData?.id);

  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialFormData,
        ...Object.fromEntries(
          Object.keys(initialFormData).map((key) => [
            key,
            initialData[key] ?? initialFormData[key],
          ])
        ),
      });
    } else {
      setFormData({
        ...initialFormData,
        vehicle_type: selectedVehicleType,
      });
    }

    setImages([]);
    setMessage("");

    const fileInput = document.getElementById("insurance-images");
    if (fileInput) fileInput.value = "";
  }, [initialData, selectedVehicleType]);

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
      setMessage(
        "Please select exactly 8 images, or leave empty to keep existing images."
      );
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

    if (!isEditing && images.length !== 8) {
      setMessage("Please select exactly 8 images.");
      setMessageType("error");
      return;
    }

    if (isEditing && images.length !== 0 && images.length !== 8) {
      setMessage(
        "Select exactly 8 replacement images, or leave empty to keep existing images."
      );
      setMessageType("error");
      return;
    }

    if (!formData.vehicle_type) {
      setMessage("Please select a vehicle type.");
      setMessageType("error");
      return;
    }

    if (typeof onSubmit !== "function") {
      setMessage("Form submission handler is not configured.");
      setMessageType("error");
      return;
    }

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value ?? "");
    });

    images.forEach((file) => {
      payload.append("insurance_images", file);
    });

    setSubmitting(true);
    setMessage("");

    try {
      const response = await onSubmit(payload);

      if (response?.success === false) {
        throw new Error(
          response.message || "Failed to save insurance listing."
        );
      }

      setMessage(
        response?.message ||
          (isEditing
            ? "Insurance listing updated successfully."
            : "Insurance listing created successfully.")
      );
      setMessageType("success");

      if (!isEditing) {
        setFormData({
          ...initialFormData,
          vehicle_type: selectedVehicleType,
        });

        setImages([]);

        const fileInput = document.getElementById("insurance-images");
        if (fileInput) fileInput.value = "";
      }
    } catch (error) {
      console.error("INSURANCE FORM SUBMISSION FAILED:", error);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to save insurance listing."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="insurance-form" onSubmit={handleSubmit}>
      <h3>
        {isEditing
          ? "Edit Insurance Business Information"
          : "Insurance Business Information"}
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

      <div className="insurance-form-grid">
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
          Insurance Cover *
          <input
            name="cover"
            value={formData.cover}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Country
          <input value="Pakistan" readOnly />
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

        <label className="insurance-full-width">
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
            name="insurance_featured_type"
            value={formData.insurance_featured_type}
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
          Insurance Services
          <input
            name="insurance_deals_in"
            value={formData.insurance_deals_in}
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
          <input value="Insurance" readOnly />
        </label>

        <label className="insurance-full-width">
          Description *
          <textarea
            name="insurance_description"
            value={formData.insurance_description}
            onChange={handleChange}
            rows={4}
            required
          />
        </label>

        {isEditing && (
          <div className="insurance-full-width">
            <strong>Current Business Images</strong>

            <div className="insurance-form-grid">
              {imageFields.map((field, index) => {
                const imageUrl = getImageUrl(initialData?.[field]);

                return imageUrl ? (
                  <img
                    key={field}
                    src={imageUrl}
                    alt={`Insurance business ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "120px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : null;
              })}
            </div>
          </div>
        )}

        <label className="insurance-full-width">
          Business Images {isEditing ? "(optional)" : "(exactly 8) *"}

          <input
            id="insurance-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
            required={!isEditing}
          />

          <small>
            {images.length === 8
              ? "8 replacement images selected."
              : isEditing
                ? "Leave empty to keep current images, or select exactly 8 replacements."
                : `${images.length} of 8 images selected`}
          </small>
        </label>
      </div>

      <button
        type="submit"
        className="insurance-submit-button"
        disabled={submitting || disabled}
      >
        {submitting || disabled
          ? "Saving..."
          : isEditing
            ? "Update Insurance Details"
            : "Submit Insurance Details"}
      </button>

      {isEditing && onCancel && (
        <button
          type="button"
          className="insurance-submit-button"
          disabled={submitting || disabled}
          onClick={onCancel}
        >
          Cancel Editing
        </button>
      )}
    </form>
  );
}

export default InsuranceForm;
