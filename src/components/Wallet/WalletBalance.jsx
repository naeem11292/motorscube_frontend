
import "./WalletBalance.css";

function WalletBalance() {
  // Temporary value for frontend design.
  // We will fetch the real balance from the backend later.
  const balance = 0;

  return (
    <section className="wallet-balance-card">
      <div className="wallet-balance-top">
        <div>
          <span className="wallet-balance-label">Available Balance</span>
          <h2 className="wallet-balance-amount">
            <span className="wallet-currency">PKR</span>{" "}
            {balance.toLocaleString("en-PK", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="wallet-balance-description">
            Your available funds for MotorsCube services and advertisements.
          </p>
        </div>

        <div className="wallet-balance-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="6" width="18" height="15" rx="2" />
            <path d="M3 10h18" />
            <path d="M16 15h2" />
            <path d="M6 6V4a2 2 0 0 1 2-2h10" />
          </svg>
        </div>
      </div>

      <div className="wallet-balance-divider" />

      <div className="wallet-balance-footer">
        <div className="wallet-account-status">
          <span className="wallet-status-dot" />
          <span>Wallet Account</span>
        </div>

        <div className="wallet-balance-actions">
          <button
            type="button"
            className="wallet-action-button wallet-add-funds"
            onClick={() =>
              alert("Add funds will be connected after backend integration.")
            }
          >
            <span aria-hidden="true">+</span> Add Funds
          </button>

          <button
            type="button"
            className="wallet-action-button wallet-view-history"
            onClick={() =>
              document
                .querySelector(".wallet-transactions-section")
                ?.scrollIntoView({ behavior: "smooth", block: "start" })
            }
          >
            View History
          </button>
        </div>
      </div>
    </section>
  );
}

export default WalletBalance;
