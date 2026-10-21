import { useState } from "react";
import api from "../../../api/axios";
import "./DrivingSchoolForm.css";

const initialFormData = {
  vehicle_type: "car",
  name: "",
  city: "",
  school_vehicle_type: "",
  sector: "",
  subsector: "",
  address: "",
  phone: "",
  email: "",
  web: "",
  school_time_from: "",
  school_time_to: "",
  service_1: "",
  service_2: "",
  service_3: "",
  school_description: "",
  school_featured_type: "Basic",
  post_status: "pending",
  ad_for: "driving_school",
};

function DrivingSchoolForm() {
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
      data.append("school_images", image);
    });

    try {
      setLoading(true);

      // Assumes the backend endpoint is POST /drivingSchool
      const response = await api.post("/drivingSchool", data);

      setMessage(
        response.data?.message || "Driving school created successfully."
      );

      setFormData(initialFormData);
      setImages([]);

      const fileInput = document.getElementById("school-images");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create driving school. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="driving-school-form" onSubmit={handleSubmit}>
      <h2>Driving School Information</h2>

      {message && (
        <div className="driving-school-message success">{message}</div>
      )}

      {error && (
        <div className="driving-school-message error">{error}</div>
      )}

      <div className="driving-school-grid">
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
          Driving School Name *
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
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
          School Vehicle Type *
          <input
            name="school_vehicle_type"
            value={formData.school_vehicle_type}
            onChange={handleChange}
            placeholder="e.g. Manual, Automatic, Bike"
            required
          />
        </label>

        <label>
          Sector *
          <input
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Subsector *
          <input
            name="subsector"
            value={formData.subsector}
            onChange={handleChange}
            required
          />
        </label>

        <label className="full-width">
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

        <label className="full-width">
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
          Opening Time *
          <input
            name="school_time_from"
            type="time"
            value={formData.school_time_from}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Closing Time *
          <input
            name="school_time_to"
            type="time"
            value={formData.school_time_to}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service 1 *
          <input
            name="service_1"
            value={formData.service_1}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service 2
          <input
            name="service_2"
            value={formData.service_2}
            onChange={handleChange}
          />
        </label>

        <label>
          Service 3
          <input
            name="service_3"
            value={formData.service_3}
            onChange={handleChange}
          />
        </label>

        <label>
          Featured Type *
          <select
            name="school_featured_type"
            value={formData.school_featured_type}
            onChange={handleChange}
            required
          >
            <option value="Basic">Basic</option>
            <option value="Hot Spot">Hot Spot</option>
            <option value="Supreme">Supreme</option>
          </select>
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

        <label className="full-width">
          Description *
          <textarea
            name="school_description"
            value={formData.school_description}
            onChange={handleChange}
            maxLength={255}
            rows="4"
            required
          />
        </label>

        <label className="full-width">
          Upload 8 Images *
          <input
            id="school-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImagesChange}
            required
          />
          <small>
            {images.length} of 8 images selected. Maximum 5 MB per image.
          </small>
        </label>

        {images.length > 0 && (
          <div className="driving-school-image-list full-width">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="driving-school-image-item"
              >
                <span>
                  {index + 1}. {image.name}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setImages((previous) =>
                      previous.filter((_, i) => i !== index)
                    );

                    const fileInput =
                      document.getElementById("school-images");

                    if (fileInput) fileInput.value = "";
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        className="driving-school-submit"
        type="submit"
        disabled={loading}
      >
        {loading ? "Submitting..." : "Submit Driving School"}
      </button>
    </form>
  );
}

export default DrivingSchoolForm;