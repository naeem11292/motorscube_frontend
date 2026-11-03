
import { useCallback, useEffect, useState } from "react";

import StoresForm from "../../components/Stores/StoresForm";
import AccessoriesForm from "../../components/AdAccessories/AccessoriesForm";

import {
  getStores,
  deleteStore,
} from "../../api/stores.api";

import {
  getAllAccessoriesAds,
  deleteAccessoriesAd,
} from "../../api/accessoriesAdSale.api";

import "./Stores.css";

const API_BASE = "http://localhost:5000";

function Stores() {
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [store, setStore] = useState(null);
  const [accessories, setAccessories] = useState([]);

  const [loading, setLoading] = useState(true);
  const [accessoriesLoading, setAccessoriesLoading] = useState(false);

  const [error, setError] = useState("");
  const [accessoriesError, setAccessoriesError] = useState("");

  const [editing, setEditing] = useState(false);
  const [showAccessoriesForm, setShowAccessoriesForm] = useState(false);

  const [deleting, setDeleting] = useState(false);
  const [deletingAccessoryId, setDeletingAccessoryId] = useState(null);

  const [expandedAccessoryId, setExpandedAccessoryId] = useState(null);

  const [notice, setNotice] = useState("");

  const storeId = store?.store_id ?? store?.id;

  // IMAGE URL
  const getImageUrl = (filename) => {
    if (!filename) return "";

    if (/^https?:\/\//i.test(filename)) {
      return filename;
    }

    const cleanFilename = filename.replace(/^\/?uploads\//, "");
    return `${API_BASE}/uploads/${cleanFilename}`;
  };

  // LOAD STORE
  const loadStore = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getStores();
      const data = response.data?.data;
      const list = Array.isArray(data) ? data : [];

      setStore(list[0] ?? null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your store."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // LOAD ACCESSORIES BELONGING TO THIS STORE
  const loadAccessories = useCallback(async (currentStoreId) => {
    if (!currentStoreId) {
      setAccessories([]);
      return;
    }

    setAccessoriesLoading(true);
    setAccessoriesError("");

    try {
      const response = await getAllAccessoriesAds();

      const allAds = Array.isArray(response.data)
        ? response.data
        : [];

      const storeAccessories = allAds.filter(
        (accessory) =>
          Number(accessory.store_id) === Number(currentStoreId)
      );

      setAccessories(storeAccessories);
    } catch (err) {
      setAccessoriesError(
        err.response?.data?.message ||
          "Unable to load your store accessories."
      );
    } finally {
      setAccessoriesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  useEffect(() => {
    if (storeId) {
      loadAccessories(storeId);
    } else {
      setAccessories([]);
    }
  }, [storeId, loadAccessories]);

  // DELETE STORE
  const handleDeleteStore = async () => {
    if (!store) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${store.store_name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setNotice("");

    try {
      await deleteStore(storeId);

      setStore(null);
      setAccessories([]);
      setEditing(false);

      setNotice(
        "Your store was deleted. You can create another store now."
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete your store."
      );
    } finally {
      setDeleting(false);
    }
  };

  // DELETE ACCESSORY
  const handleDeleteAccessory = async (accessory) => {
    const accessoryId = accessory.accessories_ad_sale_id;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${accessory.item_name}"?`
    );

    if (!confirmed) return;

    setDeletingAccessoryId(accessoryId);
    setAccessoriesError("");
    setNotice("");

    try {
      await deleteAccessoriesAd(accessoryId);

      setAccessories((previous) =>
        previous.filter(
          (item) =>
            Number(item.accessories_ad_sale_id) !==
            Number(accessoryId)
        )
      );

      if (Number(expandedAccessoryId) === Number(accessoryId)) {
        setExpandedAccessoryId(null);
      }

      setNotice("Accessory deleted successfully.");
    } catch (err) {
      setAccessoriesError(
        err.response?.data?.message ||
          "Unable to delete this accessory."
      );
    } finally {
      setDeletingAccessoryId(null);
    }
  };

  // LOADING STORE
  if (loading) {
    return (
      <main className="stores-page">
        <p>Loading your store...</p>
      </main>
    );
  }

  // STORE ERROR
  if (error && !store) {
    return (
      <main className="stores-page">
        <h1>MotorsCube Stores</h1>

        <p className="stores-error">{error}</p>

        <button type="button" onClick={loadStore}>
          Try Again
        </button>
      </main>
    );
  }

  // CREATE OR EDIT STORE
  if (!store || editing) {
    return (
      <main className="stores-page">
        <header className="stores-page-header">
          <h1>
            {editing ? "Edit Your Store" : "Create Your Store"}
          </h1>

          <p>
            {editing
              ? "Update your existing store information."
              : "Create your MotorsCube store and add your business details."}
          </p>
        </header>

        {notice && <p>{notice}</p>}
        {error && <p className="stores-error">{error}</p>}

        <StoresForm
          initialStore={editing ? store : undefined}
          onStoreCreated={async () => {
            setEditing(false);
            setNotice("");
            await loadStore();
          }}
          onStoreUpdated={async () => {
            setEditing(false);
            setNotice("Store details updated successfully.");
            await loadStore();
          }}
          onCancel={() => {
            setEditing(false);
            setError("");
          }}
        />
      </main>
    );
  }

  return (
    <main className="stores-page">

      {/* PAGE HEADER */}
      <header className="stores-page-header">
        <h1>{store.store_name || "My Store"}</h1>
        <p>Manage your store profile and accessories.</p>
      </header>

      {notice && <p className="stores-notice">{notice}</p>}
      {error && <p className="stores-error">{error}</p>}

      {/* =====================================
          STORE PROFILE
      ====================================== */}
      <section className="stores-list-section">
        <article className="store-payment-card" key={storeId}>

          {store.cover_image && (
            <img
              className="store-cover-image"
              src={getImageUrl(store.cover_image)}
              alt={`${store.store_name || "Store"} cover`}
            />
          )}

          <div className="store-card-content">

            <div className="store-card-heading">
              {store.logo && (
                <img
                  className="store-logo"
                  src={getImageUrl(store.logo)}
                  alt={`${store.store_name || "Store"} logo`}
                />
              )}

              <div>
                <h3>{store.store_name}</h3>

                {(store.city || store.adress) && (
                  <p className="store-location">
                    {[store.city, store.adress]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>

            {store.store_detail && (
              <p className="store-description">
                {store.store_detail}
              </p>
            )}

            {/* PAYMENT DETAILS ARE SAVED BUT NOT DISPLAYED */}

            <div className="store-actions">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setEditing(true);
                }}
              >
                Edit Store
              </button>

              <button
                type="button"
                className="store-delete-button"
                onClick={handleDeleteStore}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Store"}
              </button>
            </div>

          </div>
        </article>
      </section>

      {/* =====================================
          STORE ACCESSORIES
      ====================================== */}
      <section className="store-accessories-section">

        <header className="store-accessories-header">
          <div>
            <h2>My Store Accessories</h2>
            <p>Manage the accessories listed in your store.</p>
          </div>

          <button
            type="button"
            onClick={() => {
              setShowAccessoriesForm((previous) => !previous);
              setAccessoriesError("");
            }}
          >
            {showAccessoriesForm
              ? "Close Form"
              : "+ Add More Accessories"}
          </button>
        </header>

        {/* ADD ACCESSORY FORM */}
        {showAccessoriesForm && (
          <div className="store-add-accessory-form">
            <AccessoriesForm
              storeId={storeId}
              storeName={store.store_name}
              onAccessoryCreated={async () => {
                setNotice("Accessory added successfully.");
                await loadAccessories(storeId);
              }}
              onCancel={() => setShowAccessoriesForm(false)}
            />
          </div>
        )}

        {accessoriesError && (
          <p className="stores-error">{accessoriesError}</p>
        )}

        {/* ACCESSORIES LOADING */}
        {accessoriesLoading && (
          <p>Loading your accessories...</p>
        )}

        {/* EMPTY ACCESSORIES */}
        {!accessoriesLoading && accessories.length === 0 && (
          <div className="store-accessories-empty">
            <h3>No Accessories Listed Yet</h3>

            <p>
              Start adding accessories to showcase your products
              to customers.
            </p>

            {!showAccessoriesForm && (
              <button
                type="button"
                onClick={() => setShowAccessoriesForm(true)}
              >
                Add Your First Accessory
              </button>
            )}
          </div>
        )}

        {/* =====================================
            ACCESSORIES HORIZONTAL CARDS
        ====================================== */}
        {!accessoriesLoading && accessories.length > 0 && (
          <div className="store-accessories-list">

            {accessories.map((accessory) => {
              const accessoryId = accessory.accessories_ad_sale_id;
              const image = accessory.image_1;
              const isExpanded =
                Number(expandedAccessoryId) === Number(accessoryId);

              return (
                <article
                  className="store-accessory-card"
                  key={accessoryId}
                >

                  {/* PRODUCT IMAGE */}
                  <div className="store-accessory-image-wrapper">
                    {image ? (
                      <img
                        src={getImageUrl(image)}
                        alt={accessory.item_name || "Accessory"}
                        className="store-accessory-image"
                      />
                    ) : (
                      <div className="store-accessory-no-image">
                        <span className="no-image-icon">▧</span>
                        <span>No Image Available</span>
                      </div>
                    )}
                  </div>

                  {/* PRODUCT INFORMATION */}
                  <div className="store-accessory-content">

                    <div className="store-accessory-top">
                      <span className="accessory-category-badge">
                        {accessory.category || "Accessory"}
                      </span>

                      {accessory.post_status && (
                        <span className="accessory-status-badge">
                          {accessory.post_status}
                        </span>
                      )}
                    </div>

                    <h3 className="store-accessory-title">
                      {accessory.item_name || "Unnamed Accessory"}
                    </h3>

                    <div className="store-accessory-price">
                      PKR{" "}
                      {Number(accessory.price || 0).toLocaleString("en-PK")}
                    </div>

                    {/* PRODUCT DETAILS */}
                    <div className="store-accessory-details">

                      <div className="accessory-detail-item">
                        <span className="accessory-detail-icon">⚙</span>
                        <div>
                          <small>Condition</small>
                          <strong>
                            {accessory.item_condition || "Not specified"}
                          </strong>
                        </div>
                      </div>

                      <div className="accessory-detail-item">
                        <span className="accessory-detail-icon">◈</span>
                        <div>
                          <small>Category</small>
                          <strong>
                            {accessory.category || "Not specified"}
                          </strong>
                        </div>
                      </div>

                      <div className="accessory-detail-item">
                        <span className="accessory-detail-icon">🚗</span>
                        <div>
                          <small>For</small>
                          <strong>
                            {accessory.item_for ||
                              accessory.vehicle_type ||
                              "Not specified"}
                          </strong>
                        </div>
                      </div>

                      <div className="accessory-detail-item">
                        <span className="accessory-detail-icon">⌖</span>
                        <div>
                          <small>City</small>
                          <strong>
                            {accessory.city || "Not specified"}
                          </strong>
                        </div>
                      </div>

                    </div>

                    {/* EXPANDED DETAILS */}
                    {isExpanded && (
                      <div className="store-accessory-expanded">

                        <h4>Product Description</h4>

                        <p>
                          {accessory.description ||
                            "No description provided."}
                        </p>

                        {accessory.make && (
                          <p>
                            <strong>Make:</strong> {accessory.make}
                          </p>
                        )}

                        {accessory.model && (
                          <p>
                            <strong>Model:</strong> {accessory.model}
                          </p>
                        )}

                        {accessory.version && (
                          <p>
                            <strong>Version:</strong> {accessory.version}
                          </p>
                        )}

                        {accessory.location && (
                          <p>
                            <strong>Location:</strong> {accessory.location}
                          </p>
                        )}

                        {accessory.country && (
                          <p>
                            <strong>Country:</strong> {accessory.country}
                          </p>
                        )}

                      </div>
                    )}

                    {/* CARD FOOTER */}
                    <div className="store-accessory-footer">

                      <div className="accessory-store-name">
                        <span>▣</span>
                        <span>Store:</span>
                        <strong>{store.store_name}</strong>
                      </div>

                      <div className="accessory-card-actions">

                        <button
                          type="button"
                          className="store-accessory-delete-button"
                          onClick={() => handleDeleteAccessory(accessory)}
                          disabled={
                            deletingAccessoryId === accessoryId
                          }
                        >
                          {deletingAccessoryId === accessoryId
                            ? "Deleting..."
                            : "Delete Accessory"}
                        </button>

                        <button
                          type="button"
                          className="store-accessory-view-button"
                          onClick={() =>
                            setExpandedAccessoryId(
                              isExpanded ? null : accessoryId
                            )
                          }
                        >
                          {isExpanded
                            ? "Hide Details"
                            : "View Details"}
                        </button>

                      </div>
                    </div>

                  </div>
                </article>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}

export default Stores;
