
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

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "car", label: "Cars" },
  { value: "bike", label: "Bikes" },
  { value: "commercial", label: "Commercial Vehicles" },
  { value: "machinery", label: "Machinery" },
  { value: "plant", label: "Plants" },
];

const CATEGORY_ICONS = {
  all: "📋",
  car: "🚗",
  bike: "🏍️",
  commercial: "🚚",
  machinery: "⚙️",
  plant: "🌱",
};

function extractItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.results)) return response.results;

  // Some APIs wrap results in response.data.data.
  if (Array.isArray(response?.data?.data)) return response.data.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.results)) return response.data.results;

  return [];
}

function normalizeCategory(value) {
  const category = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

  const aliases = {
    car: "car",
    cars: "car",
    bike: "bike",
    bikes: "bike",
    motorcycle: "bike",
    motorcycles: "bike",
    motorbike: "bike",
    motorbikes: "bike",
    commercial: "commercial",
    commercialvehicle: "commercial",
    commercialvehicles: "commercial",
    machinery: "machinery",
    machine: "machinery",
    plant: "plant",
    plants: "plant",
  };

  return aliases[category] ?? category;
}

function getItemCategory(item) {
  return normalizeCategory(
    item.vehicle_type ??
      item.vehicleType ??
      item.category ??
      item.item_category ??
      item.ad_category ??
      item.type
  );
}

function getItemId(item, itemType) {
  if (itemType === "sale") {
    return item.sale_id ?? item.saleId ?? item.id;
  }

  return item.hire_id ?? item.hireId ?? item.id;
}

function getItemStatus(item) {
  return String(
    item.status ??
      item.ad_status ??
      item.sale_status ??
      item.hire_status ??
      "unknown"
  )
    .trim()
    .toLowerCase();
}

function getItemTitle(item) {
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
}

function getItemImage(item) {
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
    const imagePath =
      firstImage.url ||
      firstImage.path ||
      firstImage.filename ||
      "";

    if (!imagePath) return "";
    if (/^https?:\/\//i.test(imagePath)) return imagePath;

    return `http://localhost:5000/${String(imagePath).replace(/^\/+/, "")}`;
  }

  if (/^https?:\/\//i.test(firstImage)) return firstImage;

  return `http://localhost:5000/${String(firstImage).replace(/^\/+/, "")}`;
}

function getItemPrice(item) {
  if (item.itemType === "sale") {
    const price = item.price ?? item.sale_price ?? item.vehicle_price;

    return price != null
      ? `PKR ${Number(price).toLocaleString()}`
      : "Price not listed";
  }

  const charges = item.charges ?? item.hire_charges ?? item.price;
  const chargeType = item.charges_type ?? item.charge_type ?? "";

  if (charges == null) return "Charges not listed";

  return `PKR ${Number(charges).toLocaleString()}${
    chargeType ? ` / ${chargeType}` : ""
  }`;
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString();
}

function MyItems() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [saleCategory, setSaleCategory] = useState("all");
  const [hireCategory, setHireCategory] = useState("all");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState("");

  const tabs = [
    { id: "all", label: "All Items" },
    { id: "sale", label: "Sale Ads" },
    { id: "hire", label: "Hire Ads" },
  ];

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
        itemId: getItemId(item, "sale"),
      }));

      const hireAds = extractItems(hireResult).map((item) => ({
        ...item,
        itemType: "hire",
        itemId: getItemId(item, "hire"),
      }));

      setItems([...saleAds, ...hireAds]);
    } catch (err) {
      console.error("Failed to load My Items:", err);

      setError(
        err.response?.status === 401
          ? "Your session may have expired. Please log in again."
          : err.response?.data?.message ||
              (err.code === "ERR_NETWORK"
                ? "Cannot connect to the backend. Make sure your backend server is running."
                : "Unable to load your listings. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesTab =
        activeTab === "all" || item.itemType === activeTab;

      const status = getItemStatus(item);

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;

      const categoryFilter =
        item.itemType === "sale" ? saleCategory : hireCategory;

      const matchesCategory =
        categoryFilter === "all" ||
        getItemCategory(item) === categoryFilter;

      return matchesTab && matchesStatus && matchesCategory;
    });
  }, [
    items,
    activeTab,
    statusFilter,
    saleCategory,
    hireCategory,
  ]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Keep Sale and Hire category filters independent.
    if (tabId === "sale") setHireCategory("all");
    if (tabId === "hire") setSaleCategory("all");
  };

  const handleCategoryChange = (categoryValue) => {
    if (activeTab === "sale") {
      setSaleCategory(categoryValue);
    } else if (activeTab === "hire") {
      setHireCategory(categoryValue);
    }
  };

  const handleDelete = async (item) => {
    if (item.itemId == null) {
      setError(
        "This listing has no recognizable ID, so it cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${getItemTitle(item)}"?`
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

  const saleCount = items.filter(
    (item) => item.itemType === "sale"
  ).length;

  const hireCount = items.filter(
    (item) => item.itemType === "hire"
  ).length;

  const currentCategory =
    activeTab === "sale"
      ? saleCategory
      : activeTab === "hire"
        ? hireCategory
        : "all";

  const hasActiveFilters =
    statusFilter !== "all" || currentCategory !== "all";

  return (
    <div className="my-items-page">
      {/* Page header */}
      <div className="my-items-header">
        <div>
          <p className="my-items-eyebrow">YOUR GARAGE</p>
          <h1>My ADS</h1>
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

      {/* Summary cards */}
      <div className="my-items-summary">
        <div className="my-items-summary-card">
          <span>All Items</span>
          <strong>{items.length}</strong>
        </div>

        <div className="my-items-summary-card">
          <span>Sale Ads</span>
          <strong>{saleCount}</strong>
        </div>

        <div className="my-items-summary-card">
          <span>Hire Ads</span>
          <strong>{hireCount}</strong>
        </div>
      </div>

      {/* Tabs and status filter */}
      <div className="my-items-toolbar">
        <div className="my-items-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`my-items-tab ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}

              <span className="my-items-tab-count">
                {tab.id === "all"
                  ? items.length
                  : tab.id === "sale"
                    ? saleCount
                    : hireCount}
              </span>
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
          <option value="rejected">Rejected</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Category buttons — shown for Sale Ads and Hire Ads */}
      {(activeTab === "sale" || activeTab === "hire") && (
        <div className="my-items-category-toolbar">
          <div className="my-items-category-heading">
            <span className="my-items-category-icon">
              {activeTab === "sale" ? "🚘" : "🔑"}
            </span>

            <div>
              <h2>
                {activeTab === "sale"
                  ? "Sale Ad Categories"
                  : "Hire Ad Categories"}
              </h2>

              <p>
                Select a category to filter your advertisements.
              </p>
            </div>
          </div>

          <div
            className="my-items-category-buttons"
            role="group"
            aria-label={`${
              activeTab === "sale" ? "Sale" : "Hire"
            } ad categories`}
          >
            {CATEGORY_OPTIONS.map((category) => {
              const selectedCategory =
                activeTab === "sale" ? saleCategory : hireCategory;

              const isSelected =
                selectedCategory === category.value;

              return (
                <button
                  key={category.value}
                  type="button"
                  className={`my-items-category-button ${
                    isSelected ? "active" : ""
                  }`}
                  onClick={() =>
                    handleCategoryChange(category.value)
                  }
                  aria-pressed={isSelected}
                >
                  <span className="my-items-category-button-icon">
                    {CATEGORY_ICONS[category.value]}
                  </span>

                  <span>{category.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="my-items-error" role="alert">
          {error}
        </div>
      )}

      {/* Listings */}
      <div className="my-items-content">
        {loading ? (
          <div className="my-items-message">
            <h2>Loading your listings...</h2>
            <p>
              Please wait while we retrieve your advertisements.
            </p>
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
                : "Try selecting another category or status, or switch to another tab."}
            </p>

            <div className="my-items-empty-actions">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSaleCategory("all");
                    setHireCategory("all");
                    setStatusFilter("all");
                  }}
                >
                  Clear Filters
                </button>
              )}

              {items.length === 0 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/dashboard/add-sale")
                    }
                  >
                    Create Sale Ad
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      navigate("/dashboard/add-hire")
                    }
                  >
                    Create Hire Ad
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="my-items-results-heading">
              <p>
                Showing <strong>{filteredItems.length}</strong>{" "}
                {filteredItems.length === 1
                  ? "listing"
                  : "listings"}
                {activeTab !== "all" &&
                  ` in ${
                    activeTab === "sale" ? "Sale Ads" : "Hire Ads"
                  }`}
              </p>
            </div>

            <div className="my-items-grid">
              {filteredItems.map((item, index) => {
                const key = `${item.itemType}-${
                  item.itemId ?? index
                }`;

                const image = getItemImage(item);
                const status = getItemStatus(item);
                const title = getItemTitle(item);
                const deleting = deletingId === key;

                const createdDate =
                  item.created_at ??
                  item.createdAt ??
                  item.user_created_date;

                return (
                  <article className="my-item-card" key={key}>
                    <div className="my-item-image-wrap">
                      {image ? (
                        <img
                          className="my-item-image"
                          src={image}
                          alt={title}
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="my-item-no-image">
                          🚘
                        </div>
                      )}

                      <span
                        className={`my-item-type ${item.itemType}`}
                      >
                        {item.itemType === "sale"
                          ? "Sale Ad"
                          : "Hire Ad"}
                      </span>
                    </div>

                    <div className="my-item-details">
                      <div className="my-item-title-row">
                        <h3>{title}</h3>

                        <span
                          className={`my-item-status ${status}`}
                        >
                          {status === "unknown"
                            ? "Status unavailable"
                            : status.charAt(0).toUpperCase() +
                              status.slice(1)}
                        </span>
                      </div>

                      <p className="my-item-price">
                        {getItemPrice(item)}
                      </p>

                      <p className="my-item-category">
                        {item.vehicle_type ??
                          item.category ??
                          "Vehicle"}
                      </p>

                      {createdDate && (
                        <p className="my-item-date">
                          Posted: {formatDate(createdDate)}
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
          </>
        )}
      </div>
    </div>
  );
}

export default MyItems;
