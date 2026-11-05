
import { useState } from "react";

import BusinessCategorySelector from "../../components/BusinessServices/BusinessCategorySelector";
import VehicleTypePopup from "../../components/BusinessServices/VehicleTypePopup";

import DealershipForm from "../../components/Dealership/DealershipForm";
import DealershipList from "../../components/Dealership/DealershipList";

import InsuranceForm from "../../components/BusinessServices/Insurance/InsuranceForm";
import InsuranceList from "../../components/BusinessServices/Insurance/InsuranceList";

import LeasingForm from "../../components/BusinessServices/Leasing/LeasingForm";
import LeasingList from "../../components/BusinessServices/Leasing/LeasingList";

import WorkshopForm from "../../components/BusinessServices/Workshop/WorkshopForm";
import ImporterForm from "../../components/BusinessServices/ImportExport/ImporterForm";
import ExporterForm from "../../components/BusinessServices/ImportExport/Exporter";
import DrivingSchoolForm from "../../components/BusinessServices/DrivingSchool/DrivingSchoolForm";
import ShowroomForm from "../../components/BusinessServices/Showroom/Showroom";

import {
  createDealership,
  updateDealership,
} from "../../api/dealership.api";

import {
  createInsurance,
  updateInsurance,
} from "../../api/insurance.api";

import {
  createLeasing,
  updateLeasing,
} from "../../api/leasing.api";

import "./BusinessServices.css";

const VEHICLE_TYPE_SERVICES = ["dealership", "insurance", "leasing"];

function BusinessServices() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [importExportType, setImportExportType] = useState("");

  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [selectedVehicleType, setSelectedVehicleType] = useState("");

  // Dealership
  const [editingDealership, setEditingDealership] = useState(null);
  const [dealershipRefreshKey, setDealershipRefreshKey] = useState(0);

  // Insurance
  const [editingInsurance, setEditingInsurance] = useState(null);
  const [insuranceRefreshKey, setInsuranceRefreshKey] = useState(0);

  // Leasing
  const [editingLeasing, setEditingLeasing] = useState(null);
  const [leasingRefreshKey, setLeasingRefreshKey] = useState(0);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // CATEGORY / VEHICLE POPUP
  // =========================

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setImportExportType("");

    setEditingDealership(null);
    setEditingInsurance(null);
    setEditingLeasing(null);

    setSelectedVehicleType("");
    setMessage("");

    if (VEHICLE_TYPE_SERVICES.includes(category)) {
      setShowVehiclePopup(true);
    } else {
      setShowVehiclePopup(false);
    }
  };

  const handleVehicleTypeSelect = ({ vehicleType, registration }) => {
    setSelectedVehicleType(vehicleType);

    if (selectedCategory === "dealership") {
      setEditingDealership(registration || null);
    }

    if (selectedCategory === "insurance") {
      setEditingInsurance(registration || null);
    }

    if (selectedCategory === "leasing") {
      setEditingLeasing(registration || null);
    }

    setMessage("");
    setShowVehiclePopup(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openVehicleTypePopup = () => {
    setEditingDealership(null);
    setEditingInsurance(null);
    setEditingLeasing(null);

    setSelectedVehicleType("");
    setMessage("");
    setShowVehiclePopup(true);
  };

  const closeVehicleTypePopup = () => {
    setShowVehiclePopup(false);
    setSelectedCategory("");
    setSelectedVehicleType("");
    setMessage("");
  };

  // =========================
  // DEALERSHIP
  // =========================

  const handleDealershipSubmit = async (formData) => {
    try {
      setSaving(true);
      setMessage("");

      if (editingDealership) {
        await updateDealership(editingDealership.id, formData);
        setMessage("Dealership updated successfully.");
        setEditingDealership(null);
      } else {
        await createDealership(formData);
        setMessage("Dealership registered successfully.");
      }

      setDealershipRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("Dealership submission error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to save dealership. Please try again."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleDealershipEdit = (dealership) => {
    setSelectedVehicleType(dealership.vehicle_type);
    setEditingDealership(dealership);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelDealershipEdit = () => {
    setEditingDealership(null);
    setMessage("");
  };

  // =========================
  // INSURANCE
  // =========================

  const handleInsuranceSubmit = async (formData) => {
    try {
      setSaving(true);
      setMessage("");

      if (editingInsurance) {
        await updateInsurance(editingInsurance.id, formData);
        setMessage("Insurance registration updated successfully.");
        setEditingInsurance(null);
      } else {
        await createInsurance(formData);
        setMessage("Insurance registration created successfully.");
      }

      setInsuranceRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("Insurance submission error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to save insurance registration. Please try again."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleInsuranceEdit = (insurance) => {
    setSelectedVehicleType(insurance.vehicle_type);
    setEditingInsurance(insurance);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelInsuranceEdit = () => {
    setEditingInsurance(null);
    setMessage("");
  };

  // =========================
  // LEASING
  // =========================

  const handleLeasingSubmit = async (formData) => {
    try {
      setSaving(true);
      setMessage("");

      if (editingLeasing) {
        await updateLeasing(editingLeasing.id, formData);
        setMessage("Leasing registration updated successfully.");
        setEditingLeasing(null);
      } else {
        await createLeasing(formData);
        setMessage("Leasing registration created successfully.");
      }

      setLeasingRefreshKey((previous) => previous + 1);
    } catch (error) {
      console.error("Leasing submission error:", error);

      setMessage(
        error.response?.data?.message ||
          "Unable to save Leasing registration. Please try again."
      );

      throw error;
    } finally {
      setSaving(false);
    }
  };

  const handleLeasingEdit = (leasing) => {
    setSelectedVehicleType(leasing.vehicle_type);
    setEditingLeasing(leasing);
    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelLeasingEdit = () => {
    setEditingLeasing(null);
    setMessage("");
  };

  // =========================
  // RENDER
  // =========================

  return (
    <main className="business-services-page">
      <BusinessCategorySelector
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />

      {/* VEHICLE TYPE POPUP */}
      {showVehiclePopup && (
        <VehicleTypePopup
          category={selectedCategory}
          onSelect={handleVehicleTypeSelect}
          onClose={closeVehicleTypePopup}
        />
      )}

      {/* DEALERSHIP */}
      {selectedCategory === "dealership" &&
        selectedVehicleType &&
        !showVehiclePopup && (
          <section className="business-service-form-section">
            <button
              type="button"
              className="business-service-cancel-button"
              onClick={openVehicleTypePopup}
              disabled={saving}
            >
              ← Change Vehicle Type
            </button>

            <h2>
              {editingDealership
                ? "Update Dealership"
                : "Dealership Registration"}
            </h2>

            {message && (
              <div className="business-service-message" role="status">
                {message}
              </div>
            )}

            <DealershipForm
              key={`${editingDealership?.id ?? "new"}-${selectedVehicleType}`}
              initialData={editingDealership}
              selectedVehicleType={selectedVehicleType}
              onSubmit={handleDealershipSubmit}
              onCancel={cancelDealershipEdit}
              disabled={saving}
            />

            <div className="business-service-existing">
              <h2>My Dealership Registrations</h2>
              <p>View and manage your existing dealership registrations.</p>

              <DealershipList
                onEdit={handleDealershipEdit}
                refreshKey={dealershipRefreshKey}
              />
            </div>
          </section>
        )}

      {/* INSURANCE */}
      {selectedCategory === "insurance" &&
        selectedVehicleType &&
        !showVehiclePopup && (
          <section className="business-service-form-section">
            <button
              type="button"
              className="business-service-cancel-button"
              onClick={openVehicleTypePopup}
              disabled={saving}
            >
              ← Change Vehicle Type
            </button>

            <h2>
              {editingInsurance
                ? "Update Insurance Registration"
                : "Insurance Registration"}
            </h2>

            {message && (
              <div className="business-service-message" role="status">
                {message}
              </div>
            )}

            <InsuranceForm
              key={`${editingInsurance?.id ?? "new"}-${selectedVehicleType}`}
              initialData={editingInsurance}
              selectedVehicleType={selectedVehicleType}
              onSubmit={handleInsuranceSubmit}
              onCancel={cancelInsuranceEdit}
              disabled={saving}
            />

            <div className="business-service-existing">
              <h2>My Insurance Registrations</h2>
              <p>View and manage your existing insurance registrations.</p>

              <InsuranceList
                onEdit={handleInsuranceEdit}
                refreshKey={insuranceRefreshKey}
              />
            </div>
          </section>
        )}

      {/* LEASING */}
      {selectedCategory === "leasing" &&
        selectedVehicleType &&
        !showVehiclePopup && (
          <section className="business-service-form-section">
            <button
              type="button"
              className="business-service-cancel-button"
              onClick={openVehicleTypePopup}
              disabled={saving}
            >
              ← Change Vehicle Type
            </button>

            <h2>
              {editingLeasing
                ? "Update Leasing Registration"
                : "Leasing Registration"}
            </h2>

            {message && (
              <div className="business-service-message" role="status">
                {message}
              </div>
            )}

            <LeasingForm
              key={`${editingLeasing?.id ?? "new"}-${selectedVehicleType}`}
              initialData={editingLeasing}
              selectedVehicleType={selectedVehicleType}
              onSubmit={handleLeasingSubmit}
              onCancel={cancelLeasingEdit}
              disabled={saving}
            />

            <div className="business-service-existing">
              <h2>My Leasing Registrations</h2>
              <p>View and manage your existing Leasing registrations.</p>

              <LeasingList
                onEdit={handleLeasingEdit}
                refreshKey={leasingRefreshKey}
              />
            </div>
          </section>
        )}

      {/* WORKSHOP */}
      {selectedCategory === "workshop" && (
        <section className="business-service-form-section">
          <h2>Workshop Form</h2>
          <WorkshopForm />
        </section>
      )}

      {/* DRIVING SCHOOL */}
      {selectedCategory === "drivingSchool" && (
        <section className="business-service-form-section">
          <h2>Driving School Form</h2>
          <DrivingSchoolForm />
        </section>
      )}

      {/* SHOWROOM */}
      {selectedCategory === "showroom" && (
        <section className="business-service-form-section">
          <h2>Showroom Form</h2>
          <ShowroomForm />
        </section>
      )}

      {/* IMPORT / EXPORT */}
      {selectedCategory === "importExport" && !importExportType && (
        <section className="business-service-form-section">
          <h2>Importer / Exporter</h2>
          <p>
            Choose which type of business listing you want to create.
          </p>

          <div className="import-export-choice-grid">
            <button
              type="button"
              className="import-export-choice-card"
              onClick={() => setImportExportType("importer")}
            >
              <h3>Importer</h3>
              <p>Import vehicles and automotive products.</p>
            </button>

            <button
              type="button"
              className="import-export-choice-card"
              onClick={() => setImportExportType("exporter")}
            >
              <h3>Exporter</h3>
              <p>Export vehicles and automotive products.</p>
            </button>
          </div>
        </section>
      )}

      {selectedCategory === "importExport" && importExportType && (
        <section className="business-service-form-section">
          <button
            type="button"
            className="import-export-back-button"
            onClick={() => setImportExportType("")}
          >
            ← Back to Importer / Exporter
          </button>

          {importExportType === "importer" ? (
            <>
              <h2>Importer Form</h2>
              <ImporterForm />
            </>
          ) : (
            <>
              <h2>Exporter Form</h2>
              <ExporterForm />
            </>
          )}
        </section>
      )}
    </main>
  );
}

export default BusinessServices;
