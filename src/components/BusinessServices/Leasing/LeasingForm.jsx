
import { useState } from "react";
import { createLeasing } from "../../../api/leasing.api";
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

function LeasingForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selected = Array.from(event.target.files || []);

    if (selected.length !== 8) {
      setImages(selected);
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

    if (submitting) return;

    if (images.length !== 8) {
      setMessage("Please select exactly 8 images.");
      setMessageType("error");
      return;
    }

    if (!localStorage.getItem("motorscube_token")) {
      setMessage("Your session is missing. Please log in again.");
      setMessageType("error");
      return;
    }

    const payload = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });

    images.forEach((file) => {
      payload.append("leasing_images", file);
    });

    setSubmitting(true);
    setMessage("");

    try {
      const response = await createLeasing(payload);

      setMessage(
        response.message || "Leasing listing created successfully."
      );
      setMessageType("success");
      setFormData(initialFormData);
      setImages([]);

      const fileInput = document.getElementById("leasing-images");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("LEASING SUBMISSION FAILED:", error);
      console.error("API status:", error.response?.status);
      console.error("API response:", error.response?.data);

      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to submit leasing listing."
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="leasing-form" onSubmit={handleSubmit}>
      <h3>Leasing Business Information</h3>

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

        <label className="leasing-full-width">
          Business Images (exactly 8) *
          <input
            id="leasing-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
            required
          />
          <small>{images.length} of 8 images selected</small>
        </label>
      </div>

      <button
        type="submit"
        className="leasing-submit-button"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Leasing Details"}
      </button>
    </form>
  );
}

export default LeasingForm;
