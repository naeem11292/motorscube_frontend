
import { useEffect, useState } from "react";
import { createStore, updateStore } from "../../api/stores.api";
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

const API_BASE = "http://localhost:5000";

function StoresForm({
  initialStore = null,
  onStoreCreated,
  onStoreUpdated,
  onCancel,
}) {
  const isEditing = Boolean(initialStore);

  const [formData, setFormData] = useState(initialForm);
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Populate the form whenever a store is selected for editing.
  useEffect(() => {
    if (initialStore) {
      setFormData({
        store_name: initialStore.store_name || "",
        city: initialStore.city || "",
        adress: initialStore.adress || "",
        store_detail: initialStore.store_detail || "",
        select_option: initialStore.select_option || "",
        bank_name: initialStore.bank_name || "",
        account: initialStore.account || "",
        mobile: initialStore.mobile || "",
        jazzcash: initialStore.jazzcash || "",
      });
    } else {
      setFormData(initialForm);
    }

    setLogo(null);
    setCoverImage(null);
    setMessage("");
    setError("");

    const logoInput = document.getElementById("store-logo");
    const coverInput = document.getElementById("store-cover-image");

    if (logoInput) logoInput.value = "";
    if (coverInput) coverInput.value = "";
  }, [initialStore]);

  const getImageUrl = (filename) => {
    if (!filename) return "";

    if (filename.startsWith("http://") || filename.startsWith("https://")) {
      return filename;
    }

    return `${API_BASE}/uploads/${filename}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (e, setter) => {
    const file = e.target.files?.[0];

    if (!file) return;

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

      // Only upload new images if the user selected replacements.
      if (logo) payload.append("logo", logo);
      if (coverImage) payload.append("cover_image", coverImage);

      let response;

      if (isEditing) {
        const storeId =
          initialStore.id ??
          initialStore.store_id;

        if (storeId == null) {
          throw new Error(
            "Store ID is missing. Unable to update this store."
          );
        }

        response = await updateStore(storeId, payload);
        setMessage(response.data?.message || "Store updated successfully.");

        await onStoreUpdated?.();
      } else {
        response = await createStore(payload);
        setMessage(response.data?.message || "Store created successfully.");

        await onStoreCreated?.();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `Unable to ${isEditing ? "update" : "create"} store. Please check the details and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stores-form" onSubmit={handleSubmit}>
      <div className="stores-form-heading">
        <h2>{isEditing ? "Edit Your Store" : "Create Your Store"}</h2>
        <p>
          {isEditing
            ? "Update your store information and payment details."
            : "Set up your shop to showcase your business and sell products on MotorsCube."}
        </p>
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

        <div className="stores-payment-card stores-full-width">
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
                maxLength={255}
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
          {isEditing && initialStore.logo && (
            <div className="stores-current-image">
              <img
                src={getImageUrl(initialStore.logo)}
                alt="Current store logo"
                style={{ width: 90, height: 90, objectFit: "contain" }}
              />
              <small>Current logo — choose a file only to replace it.</small>
            </div>
          )}
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
          {isEditing && initialStore.cover_image && (
            <div className="stores-current-image">
              <img
                src={getImageUrl(initialStore.cover_image)}
                alt="Current store cover"
                style={{
                  width: "100%",
                  maxWidth: 220,
                  height: 100,
                  objectFit: "cover",
                }}
              />
              <small>Current cover — choose a file only to replace it.</small>
            </div>
          )}
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

      <div className="stores-form-actions">
        <button
          className="stores-submit"
          type="submit"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Saving Changes..."
              : "Creating Store..."
            : isEditing
              ? "Save Changes"
              : "Create Store"}
        </button>

        {isEditing && onCancel && (
          <button
            className="stores-cancel"
            type="button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default StoresForm;
