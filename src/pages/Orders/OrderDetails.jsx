
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../api/orders.api";
import "./OrderDetails.css";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getOrderById(id);

        if (isMounted) {
          setOrder(response?.data ?? null);

          if (!response?.data) {
            setError("Order details could not be found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Unable to load order details. Please try again."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchOrder();
    } else {
      setError("Invalid order ID.");
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString();
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replace(/_/g, " ")
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const getImageUrl = (image) => {
    if (!image) return "";

    if (/^https?:\/\//i.test(image)) {
      return image;
    }

    const cleanImage = image.replace(/^\/?uploads\//, "");

    return `http://localhost:5000/uploads/${cleanImage}`;
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="order-details-state">
          <div className="order-details-spinner" />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-page">
        <button
          type="button"
          className="order-details-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div className="order-details-error">
          <h2>Unable to display order</h2>
          <p>{error || "Order details could not be found."}</p>

          <button
            type="button"
            onClick={() => navigate("/dashboard/orders")}
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = getImageUrl(order.product_image);

  return (
    <div className="order-details-page">
      <div className="order-details-header">
        <button
          type="button"
          className="order-details-back"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        <div>
          <p className="order-details-eyebrow">ORDER INFORMATION</p>
          <h1>Order #{order.order_id}</h1>
          <p className="order-details-date">
            Placed on {formatDate(order.order_date)}
          </p>
        </div>
      </div>

      <div className="order-details-layout">
        <main className="order-details-main">
          <section className="order-details-card">
            <h2>Product Details</h2>

            <div className="order-product">
              {imageUrl ? (
                <img
                  className="order-product-image"
                  src={imageUrl}
                  alt={order.product_title || "Ordered product"}
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="order-product-placeholder">
                  No Image
                </div>
              )}

              <div className="order-product-info">
                <h3>{order.product_title || "Untitled Product"}</h3>
                <p>Product ID: {order.product_id}</p>
                <p>
                  Store ID: {order.store_id ?? "Not specified"}
                </p>
              </div>
            </div>
          </section>

          <section className="order-details-card">
            <h2>Delivery Information</h2>

            <div className="order-details-info-grid">
              <div className="order-details-info-item">
                <span>Buyer ID</span>
                <strong>{order.buyer_id ?? "Not available"}</strong>
              </div>

              <div className="order-details-info-item">
                <span>City</span>
                <strong>{order.buyer_city || "Not provided"}</strong>
              </div>

              <div className="order-details-info-item order-details-full">
                <span>Delivery Address</span>
                <strong>
                  {order.buyer_address || "No delivery address provided"}
                </strong>
              </div>

              <div className="order-details-info-item">
                <span>Order For</span>
                <strong>{order.order_for || "Not specified"}</strong>
              </div>
            </div>
          </section>
        </main>

        <aside className="order-details-sidebar">
          <section className="order-details-card">
            <h2>Order Status</h2>

            <div className="order-details-status-row">
              <span>Order Status</span>
              <span
                className={`order-details-badge status-${(
                  order.order_status || "pending"
                )
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {formatStatus(order.order_status)}
              </span>
            </div>

            <div className="order-details-status-row">
              <span>Payment Status</span>
              <span
                className={`order-details-badge status-${(
                  order.payment_status || "pending"
                )
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
              >
                {formatStatus(order.payment_status)}
              </span>
            </div>
          </section>

          <section className="order-details-card">
            <h2>Payment Information</h2>

            <div className="order-details-info-item">
              <span>Payment Method</span>
              <strong>
                {order.payment_method || "Not specified"}
              </strong>
            </div>

            <div className="order-details-info-item">
              <span>Order Date</span>
              <strong>{formatDate(order.order_date)}</strong>
            </div>

            <p className="order-details-note">
              Payment and delivery updates will appear here when the order
              information is updated.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default OrderDetails;
