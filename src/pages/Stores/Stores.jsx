
import { useCallback, useEffect, useState } from "react";
import StoresForm from "../../components/Stores/StoresForm";
import { getStores } from "../../api/stores.api";
import "./Stores.css";

const API_BASE = "http://localhost:5000";

function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStores = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getStores();
      const data = response.data?.data;

      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load stores."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStores();
  }, [loadStores]);

  const getImageUrl = (filename) => {
    if (!filename) return "";
    if (filename.startsWith("http")) return filename;

    return `${API_BASE}/uploads/${filename}`;
  };

  return (
    <main className="stores-page">
      <header className="stores-page-header">
        <h1>MotorsCube Stores</h1>
        <p>Create your store and view saved store payment details.</p>
      </header>

      <StoresForm onStoreCreated={loadStores} />

      <section className="stores-list-section">
        <h2>Available Stores</h2>

        {loading && <p>Loading stores...</p>}
        {error && <p className="stores-error">{error}</p>}

        {!loading && !error && stores.length === 0 && (
          <p>No stores have been created yet.</p>
        )}

        <div className="stores-cards-grid">
          {stores.map((store) => (
            <article className="store-payment-card" key={store.id}>
              {store.cover_image && (
                <img
                  className="store-cover-image"
                  src={getImageUrl(store.cover_image)}
                  alt={`${store.store_name} cover`}
                />
              )}

              <div className="store-card-content">
                <div className="store-card-heading">
                  {store.logo && (
                    <img
                      className="store-logo"
                      src={getImageUrl(store.logo)}
                      alt={`${store.store_name} logo`}
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

                <div className="store-payment-details">
                  <h4>Payment Methods</h4>

                  {store.select_option && (
                    <p>
                      <strong>Preferred method:</strong>{" "}
                      {store.select_option}
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
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Stores;
