
import { useEffect, useState } from "react";
import { createAccessoriesAd } from "../../api/accessoriesAdSale.api";
import { getStores } from "../../api/stores.api";

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

function extractStores(response) {
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.stores)) return body.stores;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.data?.stores)) return body.data.stores;

  return [];
}

export default function AccessoriesForm() {
  const [form, setForm] = useState(initialForm);
  const [store, setStore] = useState(null);
  const [checkingStore, setCheckingStore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [storeError, setStoreError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function checkStore() {
      setCheckingStore(true);
      setStoreError("");

      try {
        const response = await getStores();
        const stores = extractStores(response);

        if (!cancelled) {
          // The backend should return stores belonging to the logged-in user.
          const existingStore = stores[0] ?? null;
          setStore(existingStore);
        }
      } catch (error) {
        if (!cancelled) {
          setStoreError(
            error.response?.data?.message ||
              "Could not check your Store. Please log in again or try again."
          );
        }
      } finally {
        if (!cancelled) setCheckingStore(false);
      }
    }

    checkStore();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!store) {
      setMessage("Create a Store before posting an Accessories ad.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await createAccessoriesAd({
        ...form,
        price: Number(form.price),
        store_id:
          store.store_id ??
          store.id,
      });

      setMessage(
        response.data?.message || "Accessory ad created successfully."
      );
      setForm({ ...initialForm });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create accessory ad."
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingStore) {
    return <p>Checking your Store...</p>;
  }

  if (storeError) {
    return (
      <section>
        <p role="alert">{storeError}</p>
        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </section>
    );
  }

  if (!store) {
    return (
      <section>
        <h2>Create Your Store First</h2>
        <p>
          You need to create a Store before posting accessories for sale.
        </p>
        <a href="/dashboard/stores">Go to Stores</a>
      </section>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Post an Accessories Ad</h2>
      <p>
        Store: {store.store_name || store.name || "Your Store"}
      </p>

      <label>
        Vehicle Type
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
        Item Name
        <input
          name="item_name"
          value={form.item_name}
          onChange={handleChange}
          placeholder="e.g. LED headlights"
          required
        />
      </label>

      <label>
        Item For
        <input
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
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="e.g. Lighting"
        />
      </label>

      <label>
        Subcategory
        <input
          name="sub_category"
          value={form.sub_category}
          onChange={handleChange}
          placeholder="e.g. LED headlights"
        />
      </label>

      <label>
        Price (PKR)
        <input
          type="number"
          name="price"
          min="0.01"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Make
        <input
          name="make"
          value={form.make}
          onChange={handleChange}
        />
      </label>

      <label>
        Model
        <input
          name="model"
          value={form.model}
          onChange={handleChange}
        />
      </label>

      <label>
        Version
        <input
          name="version"
          value={form.version}
          onChange={handleChange}
        />
      </label>

      <label>
        City
        <input
          name="city"
          value={form.city}
          onChange={handleChange}
        />
      </label>

      <label>
        Location
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
        />
      </label>

      <label>
        Description
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Accessories Ad"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}
