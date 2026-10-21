
import { useState } from "react";
import { createInsurance } from "../../../api/insurance.api";
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

function InsuranceForm() {
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

  console.log("INSURANCE FORM SUBMIT HANDLER STARTED");
  console.log("Selected images:", images.length);
  console.log(
    "Token exists:",
    Boolean(localStorage.getItem("motorscube_token"))
  );

  if (submitting) return;

  if (images.length !== 8) {
    setMessage(`Please select exactly 8 images. Currently selected: ${images.length}.`);
    setMessageType("error");
    return;
  }

  const token = localStorage.getItem("motorscube_token");

  if (!token) {
    setMessage("Your session is missing. Please log in again.");
    setMessageType("error");
    return;
  }

  const payload = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    payload.append(key, value);
  });

  images.forEach((file) => {
    payload.append("insurance_images", file);
  });

  setSubmitting(true);
  setMessage("");

  try {
    console.log("Sending Insurance API request");

    const response = await createInsurance(payload);

    console.log("INSURANCE API SUCCESS:", response);

    setMessage(response.message || "Insurance listing created successfully.");
    setMessageType("success");
    setFormData(initialFormData);
    setImages([]);

    const fileInput = document.getElementById("insurance-images");
    if (fileInput) fileInput.value = "";
  } catch (error) {
    console.error("INSURANCE SUBMISSION FAILED:", error);
    console.error("API status:", error.response?.status);
    console.error("API response:", error.response?.data);

    setMessage(
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to submit insurance listing."
    );
    setMessageType("error");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <form className="insurance-form" onSubmit={handleSubmit}>
      <h3>Insurance Business Information</h3>

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
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Vehicle Type *
          <select name="vehicle_type" value={formData.vehicle_type} onChange={handleChange} required>
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
          <input name="cover" value={formData.cover} onChange={handleChange} required />
        </label>

        <label>
          Country
          <input value="Pakistan" readOnly />
        </label>

        <label>
          City *
          <input name="city" value={formData.city} onChange={handleChange} required />
        </label>

        <label className="insurance-full-width">
          Address *
          <input name="address" value={formData.address} onChange={handleChange} required />
        </label>

        <label>
          Phone *
          <input name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
        </label>

        <label>
          Email *
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </label>

        <label>
          Website *
          <input name="web" type="url" value={formData.web} onChange={handleChange} placeholder="https://example.com" required />
        </label>

        <label>
          Featured Plan *
          <select name="insurance_featured_type" value={formData.insurance_featured_type} onChange={handleChange} required>
            <option value="basic">Basic</option>
            <option value="medium">Medium</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
          </select>
        </label>

        <label>
          Insurance Services
          <input name="insurance_deals_in" value={formData.insurance_deals_in} onChange={handleChange} />
        </label>

        <label>
          Post Status *
          <select name="post_status" value={formData.post_status} onChange={handleChange} required>
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
          <textarea name="insurance_description" value={formData.insurance_description} onChange={handleChange} rows={4} required />
        </label>

        <label className="insurance-full-width">
          Business Images (exactly 8) *
          <input
            id="insurance-images"
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
        className="insurance-submit-button"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Insurance Details"}
      </button>
    </form>
  );
}

export default InsuranceForm;
