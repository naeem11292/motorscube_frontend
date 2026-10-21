
import { useState } from "react";
import BusinessCategorySelector from "../../components/BusinessServices/BusinessCategorySelector";
import DealershipForm from "../../components/Dealership/DealershipForm";
import InsuranceForm from "../../components/BusinessServices/Insurance/InsuranceForm";
import LeasingForm from "../../components/BusinessServices/Leasing/LeasingForm";
import WorkshopForm from "../../components/BusinessServices/Workshop/WorkshopForm";
import ImporterForm from "../../components/BusinessServices/ImportExport/ImporterForm";
import ExporterForm from "../../components/BusinessServices/ImportExport/Exporter";
import DrivingSchoolForm from "../../components/BusinessServices/DrivingSchool/DrivingSchoolForm";
import "./BusinessServices.css";

function BusinessServices() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [importExportType, setImportExportType] = useState("");

  const categoryNames = {
    dealership: "Dealership",
    insurance: "Insurance",
    leasing: "Leasing",
    workshop: "Workshop",
    importExport: "Importer / Exporter",
    drivingSchool: "Driving School",
    showroom: "Showroom",
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setImportExportType("");
  };

  return (
    <main className="business-services-page">
      <BusinessCategorySelector
        selectedCategory={selectedCategory}
        onSelect={handleCategorySelect}
      />

      {selectedCategory === "dealership" && (
        <section className="business-service-form-section">
          <h2>Dealership Form</h2>
          <DealershipForm />
        </section>
      )}

      {selectedCategory === "insurance" && (
        <section className="business-service-form-section">
          <h2>Insurance Form</h2>
          <InsuranceForm />
        </section>
      )}

      {selectedCategory === "leasing" && (
        <section className="business-service-form-section">
          <h2>Leasing Form</h2>
          <LeasingForm />
        </section>
      )}

      {selectedCategory === "workshop" && (
        <section className="business-service-form-section">
          <h2>Workshop Form</h2>
          <WorkshopForm />
        </section>
      )}

      {selectedCategory === "drivingSchool" && (
        <section className="business-service-form-section">
          <h2>Driving School Form</h2>
          <DrivingSchoolForm />
        </section>
      )}

      {selectedCategory === "importExport" && !importExportType && (
        <section className="business-service-form-section">
          <h2>Importer / Exporter</h2>
          <p>Choose which type of business listing you want to create.</p>

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

      {selectedCategory &&
        ![
          "dealership",
          "insurance",
          "leasing",
          "workshop",
          "importExport",
          "drivingSchool",
        ].includes(selectedCategory) && (
          <section className="business-service-form-section">
            <h2>{categoryNames[selectedCategory]} Form</h2>
            <p>This form will be implemented next.</p>
          </section>
        )}
    </main>
  );
}

export default BusinessServices;
