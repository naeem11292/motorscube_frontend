
import { useCallback, useEffect, useState } from "react";
import StoresForm from "../../components/Stores/StoresForm";
import {
  getStores,
  updateStore,
  deleteStore,
} from "../../api/stores.api";
import "./Stores.css";

const API_BASE = "http://localhost:5000";

function Stores() {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState("");

  const loadStore = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getStores();
      const data = response.data?.data;
      const list = Array.isArray(data) ? data : [];

      // This assumes the API response contains the current user's store
      // or that the first store is the intended store.
      setStore(list[0] ?? null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load your store."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const getImageUrl = (filename) => {
    if (!filename) return "";
    if (/^https?:\/\//i.test(filename)) return filename;

    const cleanFilename = filename.replace(/^\/?uploads\//, "");
    return `${API_BASE}/uploads/${cleanFilename}`;
  };

  const handleDelete = async () => {
    if (!store) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${store.store_name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setNotice("");

    try {
      await deleteStore(store.id);
      setStore(null);
      setEditing(false);
      setNotice("Your store was deleted. You can create another store now.");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete your store."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="stores-page">
        <p>Loading your store...</p>
      </main>
    );
  }

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

  if (!store || editing) {
    return (
      <main className="stores-page">
        <header className="stores-page-header">
          <h1>{editing ? "Edit Your Store" : "Create Your Store"}</h1>
          <p>
            {editing
              ? "Update your existing store information."
              : "Create your MotorsCube store and add your business details."}
          </p>
        </header>

        {notice && <p>{notice}</p>}
        {error && <p className="stores-error">{error}</p>}

        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setError("");
            }}
          >
            Cancel
          </button>
        )}

        <StoresForm
          onStoreCreated={async () => {
            setEditing(false);
            setNotice("");
            await loadStore();
          }}
          initialStore={editing ? store : undefined}
          isEditing={editing}
          onStoreUpdated={async () => {
            setEditing(false);
            setNotice("Store details updated successfully.");
            await loadStore();
          }}
          updateStore={updateStore}
        />
      </main>
    );
  }

  return (
    <main className="stores-page">
      <header className="stores-page-header">
        <h1>{store.store_name || "My Store"}</h1>
        <p>Manage your store details and payment information.</p>
      </header>

      {notice && <p>{notice}</p>}
      {error && <p className="stores-error">{error}</p>}

      <section className="stores-list-section">
        <article className="store-payment-card" key={store.id}>
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
                    {[store.city, store.adress].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>

            {store.store_detail && (
              <p className="store-description">{store.store_detail}</p>
            )}

            <div className="store-payment-details">
              <h4>Payment Methods</h4>

              {store.select_option && (
                <p>
                  <strong>Preferred method:</strong> {store.select_option}
                </p>
              )}
              {store.bank_name && (
                <p>
                  <strong>Bank:</strong> {store.bank_name}
                </p>
              )}
              {store.account && (
                <p>
                  <strong>Account number:</strong> {store.account}
                </p>
              )}
              {store.jazzcash && (
                <p>
                  <strong>JazzCash:</strong> {store.jazzcash}
                </p>
              )}
              {store.mobile && (
                <p>
                  <strong>Mobile:</strong> {store.mobile}
                </p>
              )}

              {!store.select_option &&
                !store.bank_name &&
                !store.account &&
                !store.jazzcash &&
                !store.mobile && (
                  <p>Payment details have not been added.</p>
                )}
            </div>

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
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Store"}
              </button>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}

export default Stores;
