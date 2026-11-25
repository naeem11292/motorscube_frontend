import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import DealershipForm from "../../components/Dealership/DealershipForm";
import DealershipList from "../../components/Dealership/DealershipList";
import { createDealership, updateDealership } from "../../api/dealership.api";
import "./Dealership.css";

function Dealership() {
  const [editingDealership, setEditingDealership] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (formData) => {
    setSuccess("");

    if (editingDealership) {
      await updateDealership(editingDealership.id, formData);
      setSuccess("Dealership updated successfully.");
    } else {
      await createDealership(formData);
      setSuccess("Dealership created successfully.");
    }

    setEditingDealership(null);
    setShowForm(false);
    setRefreshKey((previous) => previous + 1);
  };

  // Open form only when Update is clicked
  const handleEdit = (dealership) => {
    setEditingDealership(dealership);
    setShowForm(true);
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Open form when Add Dealership is clicked
  const handleAdd = () => {
    setEditingDealership(null);
    setShowForm(true);
    setSuccess("");
  };

  // Close form
  const handleCancel = () => {
    setEditingDealership(null);
    setShowForm(false);
    setSuccess("");
  };

  return (
    <>
      <Navbar />

      <main className="dealership-page">
        <header className="dealership-page-header">
          <h1>Dealership Management</h1>
          <p>Manage your MotorsCube dealership listings.</p>
        </header>

        {success && (
          <p className="dealership-success" role="status">
            {success}
          </p>
        )}

        {!showForm && (
          <button
            type="button"
            className="dealership-add-button"
            onClick={handleAdd}
          >
            + Add Dealership
          </button>
        )}

        {showForm && (
          <>
            <DealershipForm
              key={editingDealership?.id ?? "new-dealership"}
              initialData={editingDealership}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </>
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