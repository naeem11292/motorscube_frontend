
import { useState } from "react";
import "./PostCard.css";

const packages = {
  "Hot Spot": {
    description: "Give your ad extra visibility.",
    price: null,
  },
  Supreme: {
    description: "Promote your ad with premium visibility.",
    price: null,
  },
};

const paymentProviders = [
  "JazzCash",
  "NayaPay",
  "Easypaisa",
  "Bank Transfer",
];

function PostCard({
  walletBalance = 0,
  isLoadingWallet = false,
  onPayment,
}) {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [provider, setProvider] = useState("");

  const selectedPrice = packages[selectedPackage]?.price;

  const balance = Number(walletBalance);
  const safeBalance =
    Number.isFinite(balance) && balance >= 0 ? balance : 0;

  const insufficientBalance =
    selectedPrice != null && safeBalance < selectedPrice;

  const handlePackageChange = (name) => {
    setSelectedPackage(name);
    setPaymentType("");
    setProvider("");
  };

  const handlePayment = () => {
    if (!selectedPackage || selectedPrice == null) {
      alert("Please select a package with a configured price.");
      return;
    }

    if (isLoadingWallet && paymentType === "wallet") {
      alert("Please wait while your wallet balance loads.");
      return;
    }

    if (!paymentType) {
      alert("Please select a payment method.");
      return;
    }

    if (paymentType === "wallet" && insufficientBalance) {
      alert("Insufficient wallet balance.");
      return;
    }

    if (paymentType === "external" && !provider) {
      alert("Please select a payment provider.");
      return;
    }

    onPayment?.({
      packageName: selectedPackage,
      paymentType,
      provider: paymentType === "external" ? provider : null,
      amount: selectedPrice,
    });
  };

  return (
    <section className="post-card">
      {/* LEFT SIDE: Package options */}
      <div className="post-card-left">
        <div className="post-card-heading">
          <h2>Post Card</h2>
          <p>Choose a promotion package for your advertisement.</p>
        </div>

        <div className="post-card-packages">
          {Object.entries(packages).map(([name, item]) => (
            <button
              key={name}
              type="button"
              aria-pressed={selectedPackage === name}
              className={`post-card-package ${
                selectedPackage === name ? "selected" : ""
              }`}
              onClick={() => handlePackageChange(name)}
            >
              <span className="post-card-package-name">{name}</span>

              <span className="post-card-description">
                {item.description}
              </span>

              <span className="post-card-price">
                {item.price == null
                  ? "Price to be configured"
                  : `PKR ${item.price.toLocaleString()}`}
              </span>

              <span className="post-card-select-label">
                {selectedPackage === name
                  ? "Selected ✓"
                  : "Select package →"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: Details of the selected package */}
      <div className="post-card-right">
        {!selectedPackage ? (
          <div className="post-card-empty">
            <div className="post-card-empty-icon">↖</div>
            <h3>Select a promotion package</h3>
            <p>
              Choose Hot Spot or Supreme on the left to view its
              payment options here.
            </p>
          </div>
        ) : (
          <div className="post-card-payment">
            <div className="post-card-selected-heading">
              <span className="post-card-eyebrow">
                SELECTED PACKAGE
              </span>
              <h3>{selectedPackage}</h3>
              <p>{packages[selectedPackage].description}</p>

              <div className="post-card-selected-price">
                {selectedPrice == null
                  ? "Price to be configured"
                  : `PKR ${selectedPrice.toLocaleString()}`}
              </div>
            </div>

            <div className="post-card-payment-divider" />

            <h3 className="post-card-payment-title">
              Choose Payment Method
            </h3>

            <label className="post-card-payment-option">
              <input
                type="radio"
                name="postCardPayment"
                value="wallet"
                checked={paymentType === "wallet"}
                disabled={isLoadingWallet || selectedPrice == null}
                onChange={() => {
                  setPaymentType("wallet");
                  setProvider("");
                }}
              />

              <span>
                <strong>Pay from User Wallet</strong>
                <small>
                  {isLoadingWallet
                    ? "Loading wallet balance..."
                    : `Available balance: PKR ${safeBalance.toLocaleString()}`}
                </small>

                {!isLoadingWallet &&
                  selectedPrice != null &&
                  insufficientBalance && (
                    <small className="post-card-error">
                      Insufficient balance for this package.
                    </small>
                  )}
              </span>
            </label>

            <label className="post-card-payment-option">
              <input
                type="radio"
                name="postCardPayment"
                value="external"
                checked={paymentType === "external"}
                onChange={() => {
                  setPaymentType("external");
                  setProvider("");
                }}
              />

              <span>
                <strong>External Payment</strong>
                <small>
                  Pay using your preferred payment provider.
                </small>
              </span>
            </label>

            {paymentType === "external" && (
              <div className="post-card-providers">
                <h3>Select Provider</h3>

                {paymentProviders.map((name) => (
                  <label className="post-card-provider" key={name}>
                    <input
                      type="radio"
                      name="postCardProvider"
                      value={name}
                      checked={provider === name}
                      onChange={() => setProvider(name)}
                    />
                    {name}
                  </label>
                ))}
              </div>
            )}

            <button
              type="button"
              className="post-card-confirm"
              disabled={
                selectedPrice == null ||
                !paymentType ||
                (paymentType === "wallet" &&
                  (isLoadingWallet || insufficientBalance)) ||
                (paymentType === "external" && !provider)
              }
              onClick={handlePayment}
            >
              Continue to Payment
              <span aria-hidden="true"> →</span>
            </button>

            {selectedPrice == null && (
              <p className="post-card-note">
                Package prices must be configured before payment
                can proceed.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PostCard;
