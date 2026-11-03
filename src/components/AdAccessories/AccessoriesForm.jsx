
import { useEffect, useState } from "react";
import {
  createAccessoriesAd,
  updateAccessoriesAd,
} from "../../api/accessoriesAdSale.api";
import "./AccessoriesForm.css";

const initialForm = {
  vehicle_type: "car",
  item_name: "",
  item_for: "",
  item_condition: "new",
  city: "",
  location: "",
  country: "Pakistan",
  category: "",
  sub_category: "",
  price: "",
  make: "",
  model: "",
  version: "",
  description: "",
  private_or_trade: "private",
  seller_type: "",
};

export default function AccessoriesForm({
  storeId,
  storeName,
  initialAccessory,
  onAccessoryCreated,
  onAccessoryUpdated,
  onCancel,
}) {
  const isEditing = Boolean(initialAccessory?.accessories_ad_sale_id);

  const [form, setForm] = useState({ ...initialForm });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // LOAD EXISTING ACCESSORY WHEN EDITING
  useEffect(() => {
    if (initialAccessory) {
      setForm({
        ...initialForm,
        ...initialAccessory,
        price: initialAccessory.price ?? "",
      });
    } else {
      setForm({ ...initialForm });
    }

    setError("");
    setMessage("");
  }, [initialAccessory]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
    if (message) setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    if (!storeId) {
      setError("Your store could not be identified. Please reload the page.");
      return;
    }

    if (!form.item_name.trim()) {
      setError("Please enter the accessory name.");
      return;
    }

    const price = Number(form.price);

    if (!form.price || !Number.isFinite(price) || price <= 0) {
      setError("Please enter a valid price greater than zero.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    const payload = {
      ...form,
      item_name: form.item_name.trim(),
      item_for: form.item_for.trim(),
      category: form.category.trim(),
      sub_category: form.sub_category.trim(),
      city: form.city.trim(),
      location: form.location.trim(),
      description: form.description.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      version: form.version.trim(),
      country: form.country.trim(),
      price,
      store_id: Number(storeId),
    };

    try {
      let response;

      if (isEditing) {
        response = await updateAccessoriesAd(
          initialAccessory.accessories_ad_sale_id,
          payload
        );

        setMessage(
          response?.message || "Accessory updated successfully."
        );

        if (onAccessoryUpdated) {
          await onAccessoryUpdated(response?.data);
        }
      } else {
        response = await createAccessoriesAd(payload);

        setMessage(
          response?.message || "Accessory added successfully."
        );

        setForm({ ...initialForm });

        if (onAccessoryCreated) {
          await onAccessoryCreated(response?.data);
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          `Unable to ${isEditing ? "update" : "post"} your accessory. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="accessories-form" onSubmit={handleSubmit}>
      {/* FORM HEADER */}
      <div className="accessories-form-heading">
        <div className="accessories-heading-content">
          <span className="accessories-heading-label">
            STORE INVENTORY
          </span>

          <h2>
            {isEditing ? "Edit Accessory" : "Add an Accessory"}
          </h2>

          <p>
            {isEditing
              ? "Update your product information and save your changes."
              : "List a new product in your store and make it available to customers."}
          </p>
        </div>

        <div className="accessories-store-badge">
          <span className="accessories-store-badge-label">
            LISTING UNDER
          </span>
          <strong>{storeName || "Your Store"}</strong>
        </div>
      </div>

      {/* SECTION 1: BASIC INFORMATION */}
      <div className="accessories-form-section">
        <div className="accessories-section-heading">
          <span className="accessories-section-number">01</span>
          <div>
            <h3>Product Information</h3>
            <p>Enter the basic details of your accessory.</p>
          </div>
        </div>

        <div className="accessories-form-grid">
          <label>
            Vehicle Type <span className="required">*</span>
            <select
              name="vehicle_type"
              value={form.vehicle_type}
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
            Item Name <span className="required">*</span>
            <input
              type="text"
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="e.g. LED headlights"
              maxLength={150}
              required
            />
          </label>

          <label>
            Item For
            <input
              type="text"
              name="item_for"
              value={form.item_for}
              onChange={handleChange}
              placeholder="e.g. Toyota Corolla"
            />
          </label>

          <label>
            Condition
            <select
              name="item_condition"
              value={form.item_condition}
              onChange={handleChange}
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
          </label>

          <label>
            Category
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Lighting"
            />
          </label>

          <label>
            Subcategory
            <input
              type="text"
              name="sub_category"
              value={form.sub_category}
              onChange={handleChange}
              placeholder="e.g. LED headlights"
            />
          </label>
        </div>
      </div>

      {/* SECTION 2: VEHICLE DETAILS */}
      <div className="accessories-form-section">
        <div className="accessories-section-heading">
          <span className="accessories-section-number">02</span>
          <div>
            <h3>Compatibility Details</h3>
            <p>Specify which vehicle makes and models this product fits.</p>
          </div>
        </div>

        <div className="accessories-form-grid">
          <label>
            Make
            <input
              type="text"
              name="make"
              value={form.make}
              onChange={handleChange}
              placeholder="e.g. Toyota"
            />
          </label>

          <label>
            Model
            <input
              type="text"
              name="model"
              value={form.model}
              onChange={handleChange}
              placeholder="e.g. Corolla"
            />
          </label>

          <label>
            Version
            <input
              type="text"
              name="version"
              value={form.version}
              onChange={handleChange}
              placeholder="e.g. Grande 1.8"
            />
          </label>
        </div>
      </div>

      {/* SECTION 3: PRICE AND LOCATION */}
      <div className="accessories-form-section">
        <div className="accessories-section-heading">
          <span className="accessories-section-number">03</span>
          <div>
            <h3>Price & Location</h3>
            <p>Set your selling price and product location.</p>
          </div>
        </div>

        <div className="accessories-form-grid">
          <label>
            Price (PKR) <span className="required">*</span>
            <div className="accessories-price-input">
              <span>Rs.</span>
              <input
                type="number"
                name="price"
                min="0.01"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                placeholder="Enter selling price"
                required
              />
            </div>
          </label>

          <label>
            Country
            <input
              type="text"
              name="country"
              value={form.country}
              onChange={handleChange}
              placeholder="Country"
            />
          </label>

          <label>
            City
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Islamabad"
            />
          </label>

          <label>
            Location / Area
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Blue Area"
            />
          </label>
        </div>
      </div>

      {/* SECTION 4: DESCRIPTION */}
      <div className="accessories-form-section">
        <div className="accessories-section-heading">
          <span className="accessories-section-number">04</span>
          <div>
            <h3>Product Description</h3>
            <p>Give customers more information about your product.</p>
          </div>
        </div>

        <label className="accessories-description-field">
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="5"
            placeholder="Describe the accessory, its features, compatibility and condition..."
          />
        </label>
      </div>

      {/* FEEDBACK */}
      {error && (
        <p className="accessories-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="accessories-success" role="status">
          {message}
        </p>
      )}

      {/* ACTION BUTTONS */}
      <div className="accessories-form-actions">
        {onCancel && (
          <button
            type="button"
            className="accessories-cancel-button"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          className="accessories-submit-button"
          disabled={loading}
        >
          {loading
            ? isEditing
              ? "Saving Changes..."
              : "Posting..."
            : isEditing
              ? "Save Changes"
              : "Post Accessories Ad"}
        </button>
      </div>
    </form>
  );
}
