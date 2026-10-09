import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createHireAd } from "../../api/AdHire.api";
import VehicleTypeSelector from "./VehicleTypeSelector";
import BasicInformation from "./BasicInformation";
import LocationInformation from "./LocationInformation";
import VehicleDetails from "./VehicleDetails";
import Description from "./Description";
import ImageUpload from "./ImageUpload";
import "./HireHero.css";

const initialFormData = {
  type: "",
  subtype: "",
  condition: "",
  make: "",
  model: "",
  version: "",
  year: "",
  registration_city: "",
  location: "",
  country: "",
  mileage: "",
  charges: "",
  charges_type: "",
  body_type: "",
  color: "",
  transmission: "",
  fuel_type: "",
  engine_size: "",
  engine_type: "",
  ignition: "",
  doors: "",
  wheels_power: "",
  driver: "",
  features: "",
  feature_type: "",
  description: "",
  user_type: "",
  ad_type: "",
  serial_no: "",
  weight: "",
  plant_name: "",
  parameter_type: "",
  dimensions: "",
  hire_period: "",
  hours_used: "",
  installation_service: "",
  maintenance_repair: "",
  regular_maintenance: "",
};

function getUserIdFromToken() {
  try {
    const token = localStorage.getItem("motorscube_token");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    const userId = Number(decoded.sub);
    return Number.isInteger(userId) && userId > 0 ? userId : null;
  } catch {
    return null;
  }
}

function HireHero() {
  const navigate = useNavigate();

  const [vehicleType, setVehicleType] = useState("car");
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const userId = getUserIdFromToken();

    if (!userId) {
      setError("Your user ID could not be read from the login token. Please sign in again.");
      return;
    }

    if (!vehicleType) {
      setError("Please select a vehicle type.");
      return;
    }

    if (formData.charges === "" || Number(formData.charges) < 0) {
      setError("Please enter valid hire charges.");
      return;
    }

    if (!formData.charges_type) {
      setError("Please select a charging period.");
      return;
    }

    const payload = {
      user_id: userId,
      vehicle_type: vehicleType,
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (value !== "") {
        payload[key] = value;
      }
    });

    const numericFields = [
      "year",
      "mileage",
      "charges",
      "serial_no",
      "hire_period",
    ];

    numericFields.forEach((key) => {
      if (payload[key] !== undefined) {
        payload[key] = Number(payload[key]);
      }
    });

    setLoading(true);

    try {
      const response = await createHireAd(payload);

      setSuccess(response.message || "Hire listing created successfully.");
      setFormData(initialFormData);
      setVehicleType("car");
      setImages([]);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create the hire listing. Please check your backend and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hire-form-container">
      <header className="hire-form-header">
        <h1>Post a Vehicle for Hire</h1>
        <p>
          Provide your vehicle or equipment details, hire charges, and
          description.
        </p>
      </header>

      {error && (
        <div role="alert" className="hire-form-alert hire-form-error">
          {error}
        </div>
      )}

      {success && (
        <div role="status" className="hire-form-alert hire-form-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <section className="hire-form-section">
          <h2>Select Vehicle Type</h2>
          <VehicleTypeSelector
            vehicleType={vehicleType}
            setVehicleType={setVehicleType}
          />
        </section>

        <BasicInformation
          formData={formData}
          handleChange={handleChange}
          vehicleType={vehicleType}
        />

        <LocationInformation
          formData={formData}
          handleChange={handleChange}
          vehicleType={vehicleType}
        />

        <VehicleDetails
          formData={formData}
          handleChange={handleChange}
          vehicleType={vehicleType}
        />

        <Description
          formData={formData}
          handleChange={handleChange}
        />

        <ImageUpload images={images} setImages={setImages} />

        <div className="hire-form-actions">
          <button
            type="button"
            className="hire-cancel-button"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="hire-submit-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Post Hire Listing"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default HireHero;