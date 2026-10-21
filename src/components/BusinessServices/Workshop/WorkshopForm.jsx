
import { useState } from "react";
import { createWorkshop } from "../../../api/workshop.api";
import "./WorkshopForm.css";

const initialFormData = {
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

function WorkshopForm() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (files.length !== 8) {
      setImages([]);
      event.target.value = "";
      setMessage("Please select exactly 8 images.");
      setMessageType("error");
      return;
    }

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      setImages([]);
      event.target.value = "";
      setMessage("Only JPG, PNG, and WebP images are allowed.");
      setMessageType("error");
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      setImages([]);
      event.target.value = "";
      setMessage("Each image must be 5 MB or smaller.");
      setMessageType("error");
      return;
    }

    setImages(files);
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (!localStorage.getItem("motorscube_token")) {
      setMessage("Please log in before submitting.");
      setMessageType("error");
      return;
    }

    if (images.length !== 8) {
      setMessage("Please select exactly 8 workshop images.");
      setMessageType("error");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    images.forEach((image) => {
      data.append("workshop_images", image);
    });

    try {
      setLoading(true);

      const response = await createWorkshop(data);

      setMessage(
        response?.message || "Workshop created successfully!"
      );
      setMessageType("success");
      setFormData(initialFormData);
      setImages([]);

      const fileInput = document.getElementById("workshop-images");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.message ||
          "Failed to create workshop."
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="workshop-form" onSubmit={handleSubmit}>
      <h2>Workshop Information</h2>

      {message && (
        <p className={`workshop-message ${messageType}`} role="status">
          {message}
        </p>
      )}

      <div className="workshop-form-grid">
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
            <option value="commercial">Commercial Vehicle</option>
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
          Workshop Sector *
          <input
            name="workshop_sector"
            value={formData.workshop_sector}
            onChange={handleChange}
            required
            placeholder="e.g. Automotive"
          />
        </label>

        <label>
          Sub-sector *
          <input
            name="sub_sector"
            value={formData.sub_sector}
            onChange={handleChange}
            required
            placeholder="e.g. Mechanical repairs"
          />
        </label>

        <label>
          Category *
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="e.g. General workshop"
          />
        </label>

        <label className="workshop-full-width">
          Business Address *
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
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email *
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label className="workshop-full-width">
          Website *
          <input
            type="url"
            name="web"
            value={formData.web}
            onChange={handleChange}
            placeholder="https://example.com"
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
          Service 2 *
          <input
            name="service_2"
            value={formData.service_2}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service 3 *
          <input
            name="service_3"
            value={formData.service_3}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Service 4 *
          <input
            name="service_4"
            value={formData.service_4}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Opening Time *
          <input
            type="time"
            name="workshop_time_from"
            value={formData.workshop_time_from}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Closing Time *
          <input
            type="time"
            name="workshop_time_to"
            value={formData.workshop_time_to}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Featured Plan *
          <select
            name="workshop_featured_type"
            value={formData.workshop_featured_type}
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
          <input value="Workshop" readOnly />
        </label>

        <label className="workshop-full-width">
          Workshop Description *
          <textarea
            name="workshop_description"
            value={formData.workshop_description}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>

        <label className="workshop-full-width">
          Workshop Images (exactly 8) *
          <input
            id="workshop-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleImageChange}
            required
          />
          <small>{images.length}/8 images selected · Max 5 MB each</small>
        </label>

        {images.length > 0 && (
          <div className="workshop-image-grid workshop-full-width">
            {images.map((image, index) => (
              <div
                className="workshop-image-preview"
                key={`${image.name}-${index}`}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Workshop ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Workshop"}
      </button>
    </form>
  );
}

export default WorkshopForm;
