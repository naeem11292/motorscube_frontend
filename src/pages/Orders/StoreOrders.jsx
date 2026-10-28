
import { useEffect, useMemo, useState } from "react";
import {
  getAllOrders,
  updateOrder,
} from "../../api/orders.api";
import "./StoreOrders.css";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const formatStatus = (status) =>
  String(status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-PK", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const statusClass = (status) =>
  String(status || "pending").toLowerCase().replace(/\s+/g, "-");

function StoreOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [savingId, setSavingId] = useState(null);
  const [notice, setNotice] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();
      const records = Array.isArray(response?.data)
        ? response.data
        : [];

      setOrders(records);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load orders. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        String(order.order_id).includes(query) ||
        String(order.product_title || "")
          .toLowerCase()
          .includes(query) ||
        String(order.buyer_id || "").includes(query);

      const matchesFilter =
        filter === "all" ||
        String(order.order_status || "pending").toLowerCase() === filter;

      return matchesSearch && matchesFilter;
    });
  }, [orders, search, filter]);

  const handleStatusChange = async (order, nextStatus) => {
    if (!nextStatus || nextStatus === order.order_status) return;

    const confirmed = window.confirm(
      `Change order #${order.order_id} status to "${formatStatus(
        nextStatus
      )}"?`
    );

    if (!confirmed) return;

    try {
      setSavingId(order.order_id);
      setNotice("");
      setError("");

      const response = await updateOrder(order.order_id, {
        order_status: nextStatus,
      });

      const updatedOrder = response?.data;

      setOrders((current) =>
        current.map((item) =>
          item.order_id === order.order_id
            ? {
                ...item,
                ...(updatedOrder || {}),
                order_status: nextStatus,
              }
            : item
        )
      );

      setNotice(`Order #${order.order_id} status updated.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not update the order status."
      );
    } finally {
      setSavingId(null);
    }
  };

  const pendingCount = orders.filter(
    (order) => order.order_status === "pending"
  ).length;

  const processingCount = orders.filter(
    (order) => order.order_status === "processing"
  ).length;

  const completedCount = orders.filter(
    (order) => order.order_status === "delivered"
  ).length;

  return (
    <main className="store-orders-page">
      <header className="store-orders-header">
        <div>
          <p className="store-orders-eyebrow">STORE MANAGEMENT</p>
          <h1>Store Orders</h1>
          <p className="store-orders-subtitle">
            Review customer orders and manage their progress.
          </p>
        </div>

        <button
          type="button"
          className="store-orders-refresh"
          onClick={loadOrders}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Orders"}
        </button>
      </header>

      <section className="store-orders-stats">
        <article className="store-orders-stat">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </article>

        <article className="store-orders-stat">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </article>

        <article className="store-orders-stat">
          <span>Processing</span>
          <strong>{processingCount}</strong>
        </article>

        <article className="store-orders-stat">
          <span>Delivered</span>
          <strong>{completedCount}</strong>
        </article>
      </section>

      <section className="store-orders-content">
        <div className="store-orders-toolbar">
          <div>
            <h2>All Orders</h2>
            <p>Search orders and manage their status.</p>
          </div>

          <input
            type="search"
            className="store-orders-search"
            placeholder="Search order, product, or buyer ID..."
            aria-label="Search store orders"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="store-orders-filters">
          {[
            { value: "all", label: "All" },
            { value: "pending", label: "Pending" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
          ].map((item) => (
            <button
              type="button"
              key={item.value}
              className={filter === item.value ? "active" : ""}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {notice && (
          <div className="store-orders-notice" role="status">
            {notice}
          </div>
        )}

        {error && (
          <div className="store-orders-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={loadOrders}>
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="store-orders-message">
            <span className="store-orders-spinner" />
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="store-orders-empty">
            <span aria-hidden="true">📦</span>
            <h3>No orders found</h3>
            <p>Try changing your search or status filter.</p>
          </div>
        ) : (
          <div className="store-orders-table-wrapper">
            <table className="store-orders-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>Order Date</th>
                  <th>Payment</th>
                  <th>Order Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id}>
                    <td>
                      <strong>#{order.order_id}</strong>
                    </td>

                    <td>
                      <div className="store-orders-product">
                        {order.product_image ? (
                          <img
                            src={
                              order.product_image.startsWith("http")
                                ? order.product_image
                                : `http://localhost:5000/uploads/${order.product_image.replace(
                                    /^\/?uploads\//,
                                    ""
                                  )}`
                            }
                            alt={order.product_title}
                          />
                        ) : (
                          <span className="store-orders-product-placeholder">
                            📦
                          </span>
                        )}

                        <span>{order.product_title}</span>
                      </div>
                    </td>

                    <td>
                      <div className="store-orders-buyer">
                        <strong>Buyer #{order.buyer_id}</strong>
                        <span>{order.buyer_city || "City not provided"}</span>
                      </div>
                    </td>

                    <td>{formatDate(order.order_date)}</td>

                    <td>
                      <span
                        className={`store-orders-badge ${statusClass(
                          order.payment_status
                        )}`}
                      >
                        {formatStatus(order.payment_status)}
                      </span>
                    </td>

                    <td>
                      <select
                        className="store-orders-status-select"
                        value={order.order_status || "pending"}
                        disabled={savingId === order.order_id}
                        onChange={(event) =>
                          handleStatusChange(order, event.target.value)
                        }
                        aria-label={`Update order ${order.order_id} status`}
                      >
                        {!ORDER_STATUSES.includes(
                          order.order_status
                        ) && (
                          <option value={order.order_status}>
                            {formatStatus(order.order_status)}
                          </option>
                        )}

                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>

                      {savingId === order.order_id && (
                        <small className="store-orders-saving">
                          Saving...
                        </small>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default StoreOrders;
