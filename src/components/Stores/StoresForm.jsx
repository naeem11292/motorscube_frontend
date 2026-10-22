
import { useState } from "react";
import { createStore } from "../../api/stores.api";
import "./StoresForm.css";

const initialForm = {
  store_name: "",
  city: "",
  adress: "",
  store_detail: "",
  select_option: "",
  bank_name: "",
  account: "",
  mobile: "",
  jazzcash: "",
};

function StoresForm({ onStoreCreated }) {
  const [formData, setFormData] = useState(initialForm);
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, setter) => {
    const file = e.target.files?.[0];

    if (!file) {
      setter(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Images must be JPG, PNG, or WebP.");
      e.target.value = "";
      setter(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Each image must be 5 MB or smaller.");
      e.target.value = "";
      setter(null);
      return;
    }

    setError("");
    setter(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, value);
      });

      if (logo) payload.append("logo", logo);
      if (coverImage) payload.append("cover_image", coverImage);

      const response = await createStore(payload);

      setMessage(response.data?.message || "Store created successfully.");
      await onStoreCreated?.();

      setFormData(initialForm);
      setLogo(null);
      setCoverImage(null);

      const logoInput = document.getElementById("store-logo");
      const coverInput = document.getElementById("store-cover-image");

      if (logoInput) logoInput.value = "";
      if (coverInput) coverInput.value = "";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create store. Please check the details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stores-form" onSubmit={handleSubmit}>
      <div className="stores-form-heading">
        <h2>Create Your Store</h2>
        <p>Enter your store information and payment details.</p>
      </div>

      <div className="stores-form-grid">
        <label>
          Store Name *
          <input
            name="store_name"
            value={formData.store_name}
            onChange={handleChange}
            required
            maxLength={255}
          />
        </label>

        <label>
          City
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            maxLength={255}
          />
        </label>

        <label>
          Mobile Number
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
        </label>

        <label className="stores-full-width">
          Address
          <input
            name="adress"
            value={formData.adress}
            onChange={handleChange}
            maxLength={255}
          />
        </label>

        <label className="stores-full-width">
          Store Details
          <textarea
            name="store_detail"
            value={formData.store_detail}
            onChange={handleChange}
            maxLength={255}
            rows={4}
          />
        </label>

        <div className="stores-payment-card">
          <div className="stores-payment-card-heading">
            <h3>Payment Details</h3>
            <p>Configure how customers can pay your store.</p>
          </div>

          <div className="stores-form-grid">
            <label>
              Store Option
              <select
                name="select_option"
                value={formData.select_option}
                onChange={handleChange}
              >
                <option value="">Select an option</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="JazzCash">JazzCash</option>
                <option value="Mobile Payment">Mobile Payment</option>
              </select>
            </label>

            <label>
              Bank Name
              <input
                name="bank_name"
                value={formData.bank_name}
                onChange={handleChange}
                maxLength={11}
              />
            </label>

            <label>
              Account Number
              <input
                name="account"
                value={formData.account}
                onChange={handleChange}
                maxLength={255}
              />
            </label>

            <label>
              JazzCash Number
              <input
                type="tel"
                name="jazzcash"
                value={formData.jazzcash}
                onChange={handleChange}
                maxLength={255}
              />
            </label>
          </div>
        </div>

        <label>
          Store Logo
          <input
            id="store-logo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleImageChange(e, setLogo)}
          />
          <small>JPG, PNG, or WebP. Maximum 5 MB.</small>
        </label>

        <label>
          Cover Image
          <input
            id="store-cover-image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleImageChange(e, setCoverImage)}
          />
          <small>JPG, PNG, or WebP. Maximum 5 MB.</small>
        </label>
      </div>

      {error && <p className="stores-error">{error}</p>}
      {message && <p className="stores-success">{message}</p>}

      <button className="stores-submit" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Create Store"}
      </button>
    </form>
  );
}

export default StoresForm;
