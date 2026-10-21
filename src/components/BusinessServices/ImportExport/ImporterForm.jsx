import { useState } from "react";
import { createImporter } from "../../../api/importExport.api";
import "./ImporterForm.css";

const initialFormData = {
  vehicle_type: "car",
  name: "",
  country: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  description: "",
  importer_featured_type: "Basic",
  importer_deals_in: "",
  post_status: "pending",
  ad_for: "importer",
};

function ImporterForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImagesChange = (event) => {
    const selectedImages = Array.from(event.target.files || []);

    setImages(selectedImages.slice(0, 8));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (images.length !== 8) {
      setError("Please select exactly 8 images.");
      return;
    }

    for (const image of images) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(image.type)) {
        setError("Only JPEG, PNG, and WebP images are allowed.");
        return;
      }

      if (image.size > 5 * 1024 * 1024) {
        setError("Each image must be 5 MB or smaller.");
        return;
      }
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((image) => {
      data.append("importer_images", image);
    });

    try {
      setLoading(true);

      const response = await createImporter(data);

      setMessage(response.message || "Importer created successfully.");
      setFormData(initialFormData);
      setImages([]);

      const fileInput = document.getElementById("importer-images");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create importer. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="importer-form" onSubmit={handleSubmit}>
      <h2>Importer Information</h2>

      {message && <div className="importer-message success">{message}</div>}
      {error && <div className="importer-message error">{error}</div>}

      <div className="importer-form-grid">
        <label>
          Vehicle Type *
          <select
            name="vehicle_type"
            value={formData.vehicle_type}
            onChange={handleChange}
            required
          >
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="commercial">Commercial</option>
            <option value="machinery">Machinery</option>
            <option value="plant">Plant</option>
          </select>
        </label>

        <label>
          Business Name *
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Country *
          <input name="country" value={formData.country} onChange={handleChange} required />
        </label>

        <label>
          City *
          <input name="city" value={formData.city} onChange={handleChange} required />
        </label>

        <label className="full-width">
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
          Featured Type *
          <select
            name="importer_featured_type"
            value={formData.importer_featured_type}
            onChange={handleChange}
            required
          >
            <option value="Basic">Basic</option>
            <option value="Hot Spot">Hot Spot</option>
            <option value="Supreme">Supreme</option>
          </select>
        </label>

        <label>
          Deals In
          <input
            name="importer_deals_in"
            value={formData.importer_deals_in}
            onChange={handleChange}
            placeholder="e.g. Japanese cars, spare parts"
          />
        </label>

        <label>
          Post Status *
          <select name="post_status" value={formData.post_status} onChange={handleChange} required>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
          </select>
        </label>

        <label className="full-width">
          Description *
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          />
        </label>

        <label className="full-width">
          Upload 8 Images *
          <input
            id="importer-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
            required
          />
          <small>{images.length} of 8 images selected. Maximum 5 MB per image.</small>
        </label>

        {images.length > 0 && (
          <div className="importer-image-list full-width">
            {images.map((image, index) => (
              <div key={`${image.name}-${index}`} className="importer-image-item">
                <span>{index + 1}. {image.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setImages((previous) => previous.filter((_, i) => i !== index));
                    const input = document.getElementById("importer-images");
                    if (input) input.value = "";
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="importer-submit-button" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Importer"}
      </button>
    </form>
  );
}

export default ImporterForm;