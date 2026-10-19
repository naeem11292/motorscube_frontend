import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DealershipForm from "../../components/Dealership/DealershipForm";
import DealershipList from "../../components/Dealership/DealershipList";
import { createDealership, updateDealership } from "../../api/dealership.api";
import "./Dealership.css";

function Dealership() {
  const [editingDealership, setEditingDealership] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (formData) => {
    setSuccess("");

    if (editingDealership) {
      await updateDealership(editingDealership.id, formData);
      setSuccess("Dealership updated successfully.");
      setEditingDealership(null);
    } else {
      await createDealership(formData);
      setSuccess("Dealership created successfully.");
    }

    setRefreshKey((previous) => previous + 1);
  };

  const handleEdit = (dealership) => {
    setEditingDealership(dealership);
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingDealership(null);
    setSuccess("");
  };

  return (
    <>
      <Navbar />

      <main className="dealership-page">
        <header className="dealership-page-header">
          <h1>Dealership Management</h1>
          <p>Create and manage your MotorsCube dealership listings.</p>
        </header>

        {success && (
          <p className="dealership-success" role="status">
            {success}
          </p>
        )}

        <DealershipForm
          key={editingDealership?.id ?? "new-dealership"}
          initialData={editingDealership}
          onSubmit={handleSubmit}
        />

        {editingDealership && (
          <button
            type="button"
            className="dealership-cancel-edit"
            onClick={handleCancelEdit}
          >
            Cancel Editing
          </button>
        )}

        <DealershipList
          onEdit={handleEdit}
          refreshKey={refreshKey}
        />
      </main>
    </>
  );
}

export default Dealership;