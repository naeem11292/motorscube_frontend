import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MyItems.css";

import {
  getAllHireAds,
  deleteHireAd,
} from "../../api/AdHire.api";

import {
  getAllSaleAds,
  deleteSaleAd,
} from "../../api/itemsAdSale.api";

function MyItems() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const tabs = [
    { id: "all", label: "All Items" },
    { id: "sale", label: "Sale Ads" },
    { id: "hire", label: "Hire Ads" },
  ];

  const extractItems = (response) => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray(response?.items)) return response.items;
    if (Array.isArray(response?.results)) return response.results;

    return [];
  };

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [saleResult, hireResult] = await Promise.all([
        getAllSaleAds(),
        getAllHireAds(),
      ]);

      const saleAds = extractItems(saleResult).map((item) => ({
        ...item,
        itemType: "sale",
        itemId: item.sale_id ?? item.saleId ?? item.id,
      }));

      const hireAds = extractItems(hireResult).map((item) => ({
        ...item,
        itemType: "hire",
        itemId: item.hire_id ?? item.hireId ?? item.id,
      }));

      setItems([...saleAds, ...hireAds]);
    } catch (err) {
      console.error("Failed to load My Items:", err);
      setError(
        err.response?.status === 401
          ? "Your session may have expired. Please log in again."
          : err.response?.data?.message ||
              "Unable to load your listings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const getStatus = (item) =>
    String(item.status ?? item.ad_status ?? "unknown").toLowerCase();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab =
        activeTab === "all" || item.itemType === activeTab;

      const status = getStatus(item);
      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      return matchesTab && matchesStatus;
    });
  }, [items, activeTab, statusFilter]);

  const getTitle = (item) => {
    const parts = [
      item.make_name ?? item.make ?? item.vehicle_make,
      item.model_name ?? item.model ?? item.vehicle_model,
      item.version_name ?? item.version,
    ].filter(Boolean);

    return (
      parts.join(" ") ||
      item.title ||
      item.name ||
      `${item.itemType === "sale" ? "Sale" : "Hire"} Advertisement`
    );
  };

  const getImage = (item) => {
    let images = item.images;

    if (typeof images === "string") {
      try {
        images = JSON.parse(images);
      } catch {
        images = [images];
      }
    }

    const firstImage =
      (Array.isArray(images) ? images[0] : null) ||
      item.image_url ||
      item.image ||
      item.image_1;

    if (!firstImage) return "";

    if (typeof firstImage === "object") {
      return firstImage.url || firstImage.path || firstImage.filename || "";
    }

    if (/^https?:\/\//i.test(firstImage)) return firstImage;

    return `http://localhost:5000/${String(firstImage).replace(/^\/+/, "")}`;
  };

  const getPrice = (item) => {
    if (item.itemType === "sale") {
      const price = item.price ?? item.sale_price ?? item.vehicle_price;
      return price != null ? `PKR ${Number(price).toLocaleString()}` : "Price not listed";
    }

    const charges = item.charges ?? item.hire_charges ?? item.price;
    const chargeType = item.charges_type ?? item.charge_type ?? "";

    if (charges == null) return "Charges not listed";

    return `PKR ${Number(charges).toLocaleString()}${chargeType ? ` / ${chargeType}` : ""}`;
  };

  const handleDelete = async (item) => {
    if (!item.itemId) {
      setError("This listing has no recognizable ID, so it cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${getTitle(item)}"?`
    );

    if (!confirmed) return;

    const key = `${item.itemType}-${item.itemId}`;
    setDeletingId(key);
    setError("");

    try {
      if (item.itemType === "sale") {
        await deleteSaleAd(item.itemId);
      } else {
        await deleteHireAd(item.itemId);
      }

      setItems((current) =>
        current.filter(
          (entry) =>
            !(
              entry.itemType === item.itemType &&
              String(entry.itemId) === String(item.itemId)
            )
        )
      );
    } catch (err) {
      console.error("Failed to delete listing:", err);
      setError(
        err.response?.data?.message ||
          "Unable to delete this listing. Please try again."
      );
    } finally {
      setDeletingId("");
    }
  };

  const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleDateString();
  };

  return (
    <div className="my-items-page">
      <div className="my-items-header">
        <div>
          <p className="my-items-eyebrow">YOUR GARAGE</p>
          <h1>My Items</h1>
          <p>Manage all your MotorsCube listings in one place.</p>
        </div>

        <button
          type="button"
          className="my-items-refresh"
          onClick={loadItems}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="my-items-summary">
        <div className="my-items-summary-card">
          <span>All Items</span>
          <strong>{items.length}</strong>
        </div>
        <div className="my-items-summary-card">
          <span>Sale Ads</span>
          <strong>{items.filter((item) => item.itemType === "sale").length}</strong>
        </div>
        <div className="my-items-summary-card">
          <span>Hire Ads</span>
          <strong>{items.filter((item) => item.itemType === "hire").length}</strong>
        </div>
      </div>

      <div className="my-items-toolbar">
        <div className="my-items-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`my-items-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          className="my-items-status-filter"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter items by status"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="sold">Sold</option>
        </select>
      </div>

      {error && (
        <div className="my-items-error" role="alert">
          {error}
        </div>
      )}

      <div className="my-items-content">
        {loading ? (
          <div className="my-items-message">
            <h2>Loading your listings...</h2>
            <p>Please wait while we retrieve your advertisements.</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="my-items-empty">
            <div className="my-items-empty-icon">🚘</div>
            <h2>
              {items.length === 0
                ? "No listings found"
                : "No listings match your filters"}
            </h2>
            <p>
              {items.length === 0
                ? "Your sale and hire advertisements will appear here after they are retrieved from your account."
                : "Try selecting another tab or status."}
            </p>
            {items.length === 0 && (
              <div className="my-items-empty-actions">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/add-sale")}
                >
                  Create Sale Ad
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/add-hire")}
                >
                  Create Hire Ad
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="my-items-grid">
            {filteredItems.map((item, index) => {
              const key = `${item.itemType}-${item.itemId ?? index}`;
              const image = getImage(item);
              const status = getStatus(item);
              const deleting = deletingId === key;

              return (
                <article className="my-item-card" key={key}>
                  <div className="my-item-image-wrap">
                    {image ? (
                      <img
                        className="my-item-image"
                        src={image}
                        alt={getTitle(item)}
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="my-item-no-image">🚘</div>
                    )}

                    <span className={`my-item-type ${item.itemType}`}>
                      {item.itemType === "sale" ? "Sale Ad" : "Hire Ad"}
                    </span>
                  </div>

                  <div className="my-item-details">
                    <div className="my-item-title-row">
                      <h3>{getTitle(item)}</h3>
                      <span className={`my-item-status ${status}`}>
                        {status === "unknown"
                          ? "Status unavailable"
                          : status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>

                    <p className="my-item-price">{getPrice(item)}</p>

                    <p className="my-item-category">
                      {item.vehicle_type ?? item.category ?? "Vehicle"}
                    </p>

                    {(item.created_at || item.createdAt) && (
                      <p className="my-item-date">
                        Posted: {formatDate(item.created_at ?? item.createdAt)}
                      </p>
                    )}

                    <div className="my-item-actions">
                      <button
                        type="button"
                        className="my-item-edit"
                        onClick={() =>
                          navigate(
                            item.itemType === "sale"
                              ? `/dashboard/add-sale?edit=${item.itemId}`
                              : `/dashboard/add-hire?edit=${item.itemId}`
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="my-item-delete"
                        onClick={() => handleDelete(item)}
                        disabled={deleting}
                      >
                        {deleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyItems;