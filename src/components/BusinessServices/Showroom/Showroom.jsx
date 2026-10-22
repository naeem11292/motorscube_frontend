
import { useState } from "react";
import api from "../../../api/axios";
import "./Showroom.css";

const initialForm = {
  vehicle_type: "car",
  name: "",
  country: "",
  city: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  showroom_time_from: "",
  showroom_time_to: "",
  showroom_description: "",
  showroom_make: "",
  showroom_featured_type: "Basic",
  showroom_deals_in: "",
  post_status: "pending",
  ad_for: "showroom",
};

function ShowroomForm() {
  const [formData, setFormData] = useState(initialForm);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleImagesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setError("");
    setMessage("");

    if (selected.length !== 8) {
      setImages([]);
      e.target.value = "";
      setError("Please select exactly 8 images.");
      return;
    }

    const invalid = selected.some(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 5 * 1024 * 1024
    );

    if (invalid) {
      setImages([]);
      e.target.value = "";
      setError("Use JPG, PNG, or WebP images. Each image must be 5 MB or smaller.");
      return;
    }

    setImages(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (images.length !== 8) {
      setError("Please select exactly 8 images.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      images.forEach((image) => {
        payload.append("showroom_images", image);
      });

      const response = await api.post("/showroom", payload);

      setMessage(
        response.data?.message || "Showroom submitted successfully."
      );
      setFormData(initialForm);
      setImages([]);

      const input = document.getElementById("showroom-images");
      if (input) input.value = "";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not submit the showroom. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Showroom Name", required: true },
    { name: "country", label: "Country", required: true },
    { name: "city", label: "City", required: true },
    { name: "address", label: "Full Address", required: true },
    { name: "phone", label: "Phone Number", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "web", label: "Website URL", type: "url", required: true },
    { name: "showroom_make", label: "Vehicle Makes", required: true },
  ];

  return (
    <form className="showroom-form" onSubmit={handleSubmit}>
      <div className="showroom-form-heading">
        <h2>Showroom Information</h2>
        <p>Enter your showroom details and upload exactly 8 images.</p>
      </div>

      <div className="showroom-form-grid">
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

        {fields.map((field) => (
          <label key={field.name}>
            {field.label} *
            <input
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name]}
              onChange={handleChange}
              required={field.required}
            />
          </label>
        ))}

        <label>
          Opening Time *
          <input
            type="time"
            name="showroom_time_from"
            value={formData.showroom_time_from}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Closing Time *
          <input
            type="time"
            name="showroom_time_to"
            value={formData.showroom_time_to}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Featured Type *
          <select
            name="showroom_featured_type"
            value={formData.showroom_featured_type}
            onChange={handleChange}
            required
          >
            <option value="Basic">Basic</option>
            <option value="Medium">Medium</option>
            <option value="Silver">Silver</option>
            <option value="Gold">Gold</option>
          </select>
        </label>

        <label>
          Deals In
          <input
            name="showroom_deals_in"
            value={formData.showroom_deals_in}
            onChange={handleChange}
            placeholder="e.g. New and used vehicles"
          />
        </label>

        <label className="showroom-full-width">
          Description *
          <textarea
            name="showroom_description"
            value={formData.showroom_description}
            onChange={handleChange}
            maxLength={255}
            rows={4}
            required
          />
          <small>{formData.showroom_description.length}/255 characters</small>
        </label>

        <label className="showroom-full-width">
          Showroom Images * (exactly 8)
          <input
            id="showroom-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
            required
          />
          <small>
            JPG, PNG, or WebP; maximum 5 MB per image.
          </small>
          {images.length > 0 && (
            <small>{images.length} images selected.</small>
          )}
        </label>
      </div>

      {error && <p className="showroom-error">{error}</p>}
      {message && <p className="showroom-success">{message}</p>}

      <button
        className="showroom-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Showroom"}
      </button>
    </form>
  );
}

export default ShowroomForm;
