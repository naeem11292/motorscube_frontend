
import { useEffect, useState } from "react";
import "./DealershipForm.css";
import DealershipImageUpload from "./DealershipImageUpload";

const initialFormData = {
  vehicle_type: "",
  business_name: "",
  country: "",
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
  post_status: "pending",
  ad_for: "dealership",
};

function DealershipForm({ onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...initialData,
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setFormData({
      ...initialFormData,
      ...initialData,
    });
    setImages([]);
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!onSubmit) {
      setError("Form submission handler is missing.");
      return;
    }

    if (!initialData && images.length === 0) {
      setError("Please select at least one dealership image.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(
          key,
          key === "dealership_deals_in" && !value ? "" : value ?? ""
        );
      });

      images.forEach((image) => {
        payload.append("dealership_images", image);
      });

      await onSubmit(payload);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save dealership."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="dealership-form"
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <h2>Dealership Information</h2>

      {error && <p className="dealership-form-error">{error}</p>}

      <div className="dealership-form-grid">
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
          Business Name *
          <input
            name="business_name"
            value={formData.business_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Country *
          <input
            name="country"
            value={formData.country}
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

        <label className="dealership-full-width">
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

        <label>
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
          Opening Time *
          <input
            type="time"
            name="dealership_time_from"
            value={formData.dealership_time_from}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Closing Time *
          <input
            type="time"
            name="dealership_time_in"
            value={formData.dealership_time_in}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Featured Type *
          <input
            name="dealership_featured_type"
            value={formData.dealership_featured_type}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Deals In
          <input
            name="dealership_deals_in"
            value={formData.dealership_deals_in ?? ""}
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
            <option value="blocked">Blocked</option>
          </select>
        </label>

        <label>
          Ad For *
          <input
            name="ad_for"
            value={formData.ad_for}
            onChange={handleChange}
            required
          />
        </label>

        <label className="dealership-full-width">
          Description *
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
          />
        </label>
      </div>

      <h3>Dealership Images (up to 8)</h3>

      <DealershipImageUpload
        images={images}
        setImages={setImages}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Dealership"}
      </button>
    </form>
  );
}

export default DealershipForm;
