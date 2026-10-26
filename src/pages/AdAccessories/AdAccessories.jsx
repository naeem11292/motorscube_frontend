
import AccessoriesForm from "../../components/AdAccessories/AccessoriesForm";
import "./AdAccessories.css";

export default function AdAccessories() {
  return (
    <main className="ad-accessories-page">
      <div className="ad-accessories-container">
        <h1>Accessories</h1>
        <p>List your vehicle accessories for sale.</p>

        <AccessoriesForm />
      </div>
    </main>
  );
}
