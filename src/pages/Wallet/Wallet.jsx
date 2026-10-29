
import WalletBalance from "../../components/Wallet/WalletBalance";
import WalletTransactions from "../../components/Wallet/WalletTransactions";
import "./Wallet.css";

function Wallet() {
  return (
    <main className="wallet-page">
      <div className="wallet-page-header">
        <span className="wallet-eyebrow">MOTORSCUBE ACCOUNT</span>
        <h1>My Wallet</h1>
        <p>
          Manage your wallet balance and keep track of your transactions.
        </p>
      </div>

      <WalletBalance />
      <WalletTransactions />
    </main>
  );
}

export default Wallet;
