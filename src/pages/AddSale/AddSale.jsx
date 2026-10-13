
import { useState, useEffect } from "react";
import axios from "../../api/axios";
import { createSaleAd } from "../../api/itemsAdSale.api";
import SellHero from "../../components/AddSale/SellHero";

import VehicleTypeSelector from "../../components/AddSale/VehicleTypeSelector";
import AdInformation from "../../components/AddSale/AdInformation";
import Description from "../../components/AddSale/Description";
import ImageUpload from "../../components/AddSale/ImageUpload";

import CarFields from "../../components/AddSale/CarFields";
import BikeFields from "../../components/AddSale/BikeFields";
import CommercialFields from "../../components/AddSale/CommercialFields";
import MachineryFields from "../../components/AddSale/MachineryFields";
import PlantFields from "../../components/AddSale/PlantFields";

import "./AddSale.css";

function AddSale() {
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [versions, setVersions] = useState([]);

  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const [formData, setFormData] = useState({
    vehicle_type: "",

    // Basic information
    type: "",
    subtype: "",
    condition: "",
    make: "",
    model: "",
    version: "",
    year: "",

    // Location
    registration_city: "",
    location: "",
    country: "",

    // Vehicle details
    mileage: "",
    price: "",
    body_type: "",
    color: "",
    transmission: "",
    fuel_type: "",
    engine_size: "",
    engine_type: "",
    doors: "",
    wheels_power: "",
    features: "",

    // Advertisement information
    user_type: "",
    ad_type: "",
    post_status: "",

    // Machinery and plant
    weight: "",
    plant_name: "",
    parameter_type: "",
    dimensions: "",
    serial_no: "",
    hours_used: "",

    description: "",
  });

  // Fetch makes when the vehicle category changes.
  useEffect(() => {
    let cancelled = false;

    const fetchMakes = async () => {
      if (!formData.vehicle_type) {
        setMakes([]);
        return;
      }

      try {
        setLoadingMakes(true);

        const response = await axios.get("/vehicle-makes", {
          params: {
            vehicle_type: formData.vehicle_type,
          },
        });

        if (!cancelled) {
          setMakes(response.data?.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch vehicle makes:", error);
          setMakes([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingMakes(false);
        }
      }
    };

    fetchMakes();

    return () => {
      cancelled = true;
    };
  }, [formData.vehicle_type]);

  // Fetch models when the selected make changes.
  useEffect(() => {
    let cancelled = false;

    const fetchModels = async () => {
      if (!formData.make) {
        setModels([]);
        return;
      }

      try {
        setLoadingModels(true);

        const response = await axios.get("/vehicle-models", {
          params: {
            vehicle_make_id: formData.make,
          },
        });

        if (!cancelled) {
          const fetchedModels = response.data?.data || [];

          setModels(
            fetchedModels.filter(
              (model) =>
                String(model.vehicle_make_id) ===
                String(formData.make)
            )
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch vehicle models:", error);
          setModels([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingModels(false);
        }
      }
    };

    fetchModels();

    return () => {
      cancelled = true;
    };
  }, [formData.make]);

  // Fetch versions when the selected model changes.
  useEffect(() => {
    let cancelled = false;

    const fetchVersions = async () => {
      const selectedModel = models.find(
        (model) => model.model_name === formData.model
      );

      if (!selectedModel) {
        setVersions([]);
        return;
      }

      try {
        setLoadingVersions(true);

        const response = await axios.get("/vehicle-versions", {
          params: {
            model_id: selectedModel.vehicle_model_id,
          },
        });

        if (!cancelled) {
          setVersions(response.data?.data || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch vehicle versions:", error);
          setVersions([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingVersions(false);
        }
      }
    };

    fetchVersions();

    return () => {
      cancelled = true;
    };
  }, [formData.model, models]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Clear the model and version when the make changes.
  const handleMakeChange = (event) => {
    const selectedMakeId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      make: selectedMakeId,
      model: "",
      version: "",
    }));

    setModels([]);
    setVersions([]);
  };

  // Clear the version when the model changes.
  const handleModelChange = (event) => {
    const selectedModel = event.target.value;

    setFormData((previous) => ({
      ...previous,
      model: selectedModel,
      version: "",
    }));

    setVersions([]);
  };

  // Reset dependent selections when the vehicle category changes.
  const handleVehicleTypeChange = (event) => {
    const selectedType = event.target.value;

    setFormData((previous) => ({
      ...previous,
      vehicle_type: selectedType,

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
      price: "",
      body_type: "",
      color: "",
      transmission: "",
      fuel_type: "",
      engine_size: "",
      engine_type: "",
      doors: "",
      wheels_power: "",
      features: "",

      weight: "",
      plant_name: "",
      parameter_type: "",
      dimensions: "",
      serial_no: "",
      hours_used: "",
    }));

    setMakes([]);
    setModels([]);
    setVersions([]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.vehicle_type) {
      alert("Please select a vehicle category.");
      return;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (images.length > 30) {
      alert("You can upload a maximum of 30 images.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      images.forEach((image) => {
        payload.append("images", image);
      });

      const response = await createSaleAd(payload);

      console.log("Sale created:", response);
      alert("Sale advertisement created successfully!");
    } catch (error) {
      console.error("Create sale error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create sale advertisement. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Shared fields for car, bike, commercial and machinery.
  function renderCommonVehicleFields() {
    return (
      <>
        <div className="form-group">
          <label htmlFor={`${formData.vehicle_type}_make`}>
            Make
          </label>

          <select
            id={`${formData.vehicle_type}_make`}
            name="make"
            value={formData.make}
            onChange={handleMakeChange}
            disabled={loadingMakes}
          >
            <option value="">
              {loadingMakes ? "Loading makes..." : "Select make"}
            </option>

            {makes.map((make) => (
              <option
                key={make.vehicle_make_id}
                value={make.vehicle_make_id}
              >
                {make.make_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`${formData.vehicle_type}_model`}>
            Model
          </label>

          <select
            id={`${formData.vehicle_type}_model`}
            name="model"
            value={formData.model}
            onChange={handleModelChange}
            disabled={!formData.make || loadingModels}
          >
            <option value="">
              {!formData.make
                ? "Select make first"
                : loadingModels
                  ? "Loading models..."
                  : "Select model"}
            </option>

            {models.map((model) => (
              <option
                key={model.vehicle_model_id}
                value={model.model_name}
              >
                {model.model_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`${formData.vehicle_type}_version`}>
            Version
          </label>

          <select
            id={`${formData.vehicle_type}_version`}
            name="version"
            value={formData.version}
            onChange={handleChange}
            disabled={!formData.model || loadingVersions}
          >
            <option value="">
              {!formData.model
                ? "Select model first"
                : loadingVersions
                  ? "Loading versions..."
                  : versions.length === 0
                    ? "No versions available"
                    : "Select version"}
            </option>

            {versions.map((version) => (
              <option
                key={version.version_id}
                value={version.version_name}
              >
                {version.version_name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`${formData.vehicle_type}_year`}>
            Year
          </label>

          <input
            id={`${formData.vehicle_type}_year`}
            name="year"
            type="number"
            min="1900"
            value={formData.year}
            onChange={handleChange}
            placeholder="e.g. 2024"
          />
        </div>

        <div className="form-group">
          <label htmlFor={`${formData.vehicle_type}_condition`}>
            Condition
          </label>

          <select
            id={`${formData.vehicle_type}_condition`}
            name="condition"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>

            {formData.vehicle_type === "bike" && (
              <option value="re-conditioned">
                Re-Conditioned
              </option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor={`${formData.vehicle_type}_location`}>
            City / Location
          </label>

          <input
            id={`${formData.vehicle_type}_location`}
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div className="form-group">
          <label
            htmlFor={`${formData.vehicle_type}_registration_city`}
          >
            Registration City
          </label>

          <input
            id={`${formData.vehicle_type}_registration_city`}
            name="registration_city"
            value={formData.registration_city}
            onChange={handleChange}
            placeholder="Enter registration city"
          />
        </div>
      </>
    );
  }

  const renderCategoryDetails = () => {
    switch (formData.vehicle_type) {
      case "car":
        return (
          <>
            <section className="add-sale-section">
              <h2>Car Basic Information</h2>

              <div className="form-group">
                <label htmlFor="car_type">Type</label>
                <input
                  id="car_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Sedan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="car_subtype">Subtype</label>
                <input
                  id="car_subtype"
                  name="subtype"
                  value={formData.subtype}
                  onChange={handleChange}
                  placeholder="e.g. Compact Sedan"
                />
              </div>

              {renderCommonVehicleFields()}
            </section>

            <CarFields
              formData={formData}
              handleChange={handleChange}
            />
          </>
        );

      case "bike":
        return (
          <>
            <section className="add-sale-section">
              <h2>Bike Basic Information</h2>

              <div className="form-group">
                <label htmlFor="bike_type">Type</label>
                <input
                  id="bike_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Motorcycle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bike_subtype">Subtype</label>
                <input
                  id="bike_subtype"
                  name="subtype"
                  value={formData.subtype}
                  onChange={handleChange}
                  placeholder="e.g. Sports Bike"
                />
              </div>

              {renderCommonVehicleFields()}
            </section>

            <BikeFields
              formData={formData}
              handleChange={handleChange}
            />
          </>
        );

      case "commercial":
        return (
          <>
            <section className="add-sale-section">
              <h2>Commercial Basic Information</h2>

              <div className="form-group">
                <label htmlFor="commercial_type">
                  Vehicle Type
                </label>
                <input
                  id="commercial_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Truck, Bus"
                />
              </div>

              <div className="form-group">
                <label htmlFor="commercial_subtype">Subtype</label>
                <input
                  id="commercial_subtype"
                  name="subtype"
                  value={formData.subtype}
                  onChange={handleChange}
                  placeholder="Enter subtype"
                />
              </div>

              {renderCommonVehicleFields()}
            </section>

            <CommercialFields
              formData={formData}
              handleChange={handleChange}
            />
          </>
        );

      case "machinery":
        return (
          <>
            <section className="add-sale-section">
              <h2>Machinery Basic Information</h2>

              <div className="form-group">
                <label htmlFor="machinery_type">
                  Machinery Type
                </label>
                <input
                  id="machinery_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Construction Machinery"
                />
              </div>

              <div className="form-group">
                <label htmlFor="machinery_subtype">Subtype</label>
                <input
                  id="machinery_subtype"
                  name="subtype"
                  value={formData.subtype}
                  onChange={handleChange}
                  placeholder="e.g. Excavator"
                />
              </div>

              {renderCommonVehicleFields()}
            </section>

            <MachineryFields
              formData={formData}
              handleChange={handleChange}
            />
          </>
        );

      case "plant":
        return (
          <>
            <section className="add-sale-section">
              <h2>Plant Basic Information</h2>

              <div className="form-group">
                <label htmlFor="plant_name">Plant Name</label>
                <input
                  id="plant_name"
                  name="plant_name"
                  value={formData.plant_name}
                  onChange={handleChange}
                  placeholder="Enter plant name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plant_type">Plant Type</label>
                <input
                  id="plant_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Power Plant"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plant_subtype">Subtype</label>
                <input
                  id="plant_subtype"
                  name="subtype"
                  value={formData.subtype}
                  onChange={handleChange}
                  placeholder="Enter subtype"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plant_condition">Condition</label>
                <select
                  id="plant_condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="">Select condition</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="plant_location">
                  City / Location
                </label>
                <input
                  id="plant_location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter city or location"
                />
              </div>
            </section>

            <PlantFields
              formData={formData}
              handleChange={handleChange}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <SellHero />

      <main className="add-sale-page">
        <div className="add-sale-header">
          <h1>Add Sale</h1>
          <p>
            Select a category and enter the relevant details for
            your advertisement.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="sale-form-section">
            <VehicleTypeSelector
              value={formData.vehicle_type}
              onChange={handleVehicleTypeChange}
            />
          </section>

          {renderCategoryDetails()}

          {formData.vehicle_type && (
            <>
              <AdInformation
                formData={formData}
                handleChange={handleChange}
              />

              <Description
                formData={formData}
                handleChange={handleChange}
              />

              <ImageUpload
                images={images}
                setImages={setImages}
              />

              <div className="add-sale-submit">
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Continue"}
                </button>
              </div>
            </>
          )}
        </form>
      </main>
    </>
  );
}

export default AddSale;
