
import "./WalletTransactions.css";

const sampleTransactions = [
  {
    id: 1,
    title: "Wallet Funds Added",
    description: "Wallet deposit",
    type: "credit",
    amount: 5000,
    date: "2026-10-25",
    status: "Completed",
  },
  {
    id: 2,
    title: "Advertisement Payment",
    description: "Vehicle sale advertisement",
    type: "debit",
    amount: 1500,
    date: "2026-10-24",
    status: "Completed",
  },
  {
    id: 3,
    title: "Wallet Funds Added",
    description: "Wallet deposit",
    type: "credit",
    amount: 2000,
    date: "2026-10-22",
    status: "Pending",
  },
];

function WalletTransactions() {
  const transactions = sampleTransactions;

  const formatAmount = (amount) =>
    `PKR ${Number(amount).toLocaleString("en-PK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <section className="wallet-transactions-section">
      <div className="wallet-transactions-header">
        <div>
          <h2>Transaction History</h2>
          <p>Review your recent wallet activity.</p>
        </div>

        <span className="wallet-transaction-count">
          {transactions.length} transactions
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="wallet-transactions-empty">
          <div className="wallet-empty-icon" aria-hidden="true">
            ↔
          </div>
          <h3>No transactions yet</h3>
          <p>
            Your wallet transactions will appear here when you start using
            your MotorsCube wallet.
          </p>
        </div>
      ) : (
        <div className="wallet-transactions-table-wrapper">
          <table className="wallet-transactions-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <div className="wallet-transaction-info">
                      <span
                        className={`wallet-transaction-icon ${transaction.type}`}
                        aria-hidden="true"
                      >
                        {transaction.type === "credit" ? "↓" : "↑"}
                      </span>

                      <div>
                        <span className="wallet-transaction-title">
                          {transaction.title}
                        </span>
                        <span className="wallet-transaction-description">
                          {transaction.description}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="wallet-transaction-date">
                    {formatDate(transaction.date)}
                  </td>

                  <td>
                    <span
                      className={`wallet-transaction-amount ${transaction.type}`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                      {formatAmount(transaction.amount)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`wallet-transaction-status ${transaction.status.toLowerCase()}`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default WalletTransactions;
