
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllOrders } from "../../api/orders.api";
import "./MyOrders.css";

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

const formatStatus = (status) =>
  String(status || "pending")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getStatusClass = (status) =>
  String(status || "pending").toLowerCase().replace(/\s+/g, "-");

function MyOrders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();

      // Your controller returns { success, message, data }.
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
          .includes(query);

      const matchesStatus =
        activeFilter === "all" ||
        String(order.order_status || "pending").toLowerCase() ===
          activeFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, activeFilter]);

  const countStatus = (status) =>
    orders.filter(
      (order) =>
        String(order.order_status || "pending").toLowerCase() === status
    ).length;

  return (
    <main className="my-orders-page">
      <header className="my-orders-header">
        <div>
          <p className="my-orders-eyebrow">MOTORSCUBE ACCOUNT</p>
          <h1>My Orders</h1>
          <p className="my-orders-subtitle">
            View and track your purchases.
          </p>
        </div>

        <div className="my-orders-total">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
        </div>
      </header>

      <section className="my-orders-stats">
        {[
          { key: "all", label: "All Orders", count: orders.length },
          { key: "pending", label: "Pending", count: countStatus("pending") },
          {
            key: "processing",
            label: "Processing",
            count: countStatus("processing"),
          },
          {
            key: "delivered",
            label: "Delivered",
            count: countStatus("delivered"),
          },
        ].map((item) => (
          <button
            type="button"
            key={item.key}
            className={`my-orders-stat ${
              activeFilter === item.key ? "active" : ""
            }`}
            onClick={() => setActiveFilter(item.key)}
          >
            <span>{item.label}</span>
            <strong>{item.count}</strong>
          </button>
        ))}
      </section>

      <section className="my-orders-content">
        <div className="my-orders-toolbar">
          <div>
            <h2>Order History</h2>
            <p>Search and review your orders.</p>
          </div>

          <input
            type="search"
            className="my-orders-search"
            placeholder="Search order ID or product..."
            aria-label="Search orders"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {loading ? (
          <div className="my-orders-message">
            <span className="my-orders-spinner" />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="my-orders-message my-orders-error">
            <h3>Could not load orders</h3>
            <p>{error}</p>
            <button type="button" onClick={loadOrders}>
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="my-orders-empty">
            <span className="my-orders-empty-icon">📦</span>
            <h3>{orders.length ? "No matching orders" : "No orders yet"}</h3>
            <p>
              {orders.length
                ? "Try a different search or status filter."
                : "Your purchases will appear here when you place an order."}
            </p>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveFilter("all");
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="my-orders-list">
            {filteredOrders.map((order) => (
              <article className="my-order-card" key={order.order_id}>
                <div className="my-order-product-image">
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
                    <span aria-hidden="true">📦</span>
                  )}
                </div>

                <div className="my-order-main">
                  <span className="my-order-number">
                    Order #{order.order_id}
                  </span>
                  <h3>{order.product_title}</h3>
                  <p>Ordered: {formatDate(order.order_date)}</p>
                  <p>
                    Payment: {formatStatus(order.payment_method || "not specified")}
                  </p>
                </div>

                <div className="my-order-statuses">
                  <span
                    className={`my-order-badge ${getStatusClass(
                      order.order_status
                    )}`}
                  >
                    {formatStatus(order.order_status)}
                  </span>

                  <span
                    className={`my-order-payment ${getStatusClass(
                      order.payment_status
                    )}`}
                  >
                    {formatStatus(order.payment_status)}
                  </span>
                </div>

                <button
                  type="button"
                  className="my-order-details-btn"
                  onClick={() =>
                    navigate(`/dashboard/orders/${order.order_id}`)
                  }
                >
                  View Details
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default MyOrders;
