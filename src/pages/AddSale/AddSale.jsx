
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
import SearchableSelect from "../../components/AddSale/SearchableSelect";

import {
  CarFront,
  Bike,
  Truck,
  Cog,
  Sprout,
  ClipboardList,
  Layers,
  Factory,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Building2,
  ClipboardCheck,
  CheckCircle2,
} from "lucide-react";

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
    user_type: "",
    ad_type: "",
    post_status: "",
    weight: "",
    plant_name: "",
    parameter_type: "",
    dimensions: "",
    serial_no: "",
    hours_used: "",
    description: "",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchMakes = async () => {
      setMakes([]);
      setModels([]);
      setVersions([]);

      if (!formData.vehicle_type) {
        setLoadingMakes(false);
        return;
      }

      try {
        setLoadingMakes(true);

        const response = await axios.get("/vehicle-makes", {
          params: { vehicle_type: formData.vehicle_type },
        });

        if (!cancelled) {
          const data = response.data?.data;
          setMakes(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch vehicle makes:",
            error.response?.data || error.message
          );
          setMakes([]);
        }
      } finally {
        if (!cancelled) setLoadingMakes(false);
      }
    };

    fetchMakes();

    return () => {
      cancelled = true;
    };
  }, [formData.vehicle_type]);

  useEffect(() => {
    let cancelled = false;

    const fetchModels = async () => {
      setModels([]);
      setVersions([]);

      if (!formData.make) {
        setLoadingModels(false);
        return;
      }

      try {
        setLoadingModels(true);

        const response = await axios.get("/vehicle-models", {
          params: { vehicle_make_id: formData.make },
        });

        if (cancelled) return;

        const data = response.data?.data;
        const fetchedModels = Array.isArray(data) ? data : [];

        setModels(
          fetchedModels.filter(
            (model) =>
              String(model.vehicle_make_id) === String(formData.make)
          )
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch vehicle models:",
            error.response?.data || error.message
          );
          setModels([]);
        }
      } finally {
        if (!cancelled) setLoadingModels(false);
      }
    };

    fetchModels();

    return () => {
      cancelled = true;
    };
  }, [formData.make]);

  useEffect(() => {
    let cancelled = false;

    const fetchVersions = async () => {
      setVersions([]);

      if (!formData.model) {
        setLoadingVersions(false);
        return;
      }

      const selectedModel = models.find(
        (model) =>
          String(model.vehicle_model_id) === String(formData.model)
      );

      if (!selectedModel?.vehicle_model_id) {
        setLoadingVersions(false);
        return;
      }

      try {
        setLoadingVersions(true);

        const response = await axios.get(
          `/version/model/${selectedModel.vehicle_model_id}`
        );

        if (!cancelled) {
          const data = response.data?.data;
          setVersions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to fetch vehicle versions:",
            error.response?.data || error.message
          );
          setVersions([]);
        }
      } finally {
        if (!cancelled) setLoadingVersions(false);
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

  const handleMakeChange = (selectedMakeId) => {
    setFormData((previous) => ({
      ...previous,
      make: selectedMakeId,
      model: "",
      version: "",
    }));

    setModels([]);
    setVersions([]);
  };

  const handleModelChange = (selectedModelId) => {
    setFormData((previous) => ({
      ...previous,
      model: selectedModelId,
      version: "",
    }));

    setVersions([]);
  };

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
      console.error(
        "Create sale error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to create sale advertisement. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  function renderCommonVehicleFields() {
    return (
      <>
        <SearchableSelect
          id={`${formData.vehicle_type}_make`}
          label="Make"
          icon={Factory}
          value={formData.make}
          options={makes}
          getOptionValue={(make) => make.vehicle_make_id}
          getOptionLabel={(make) => make.make_name}
          onChange={handleMakeChange}
          placeholder={
            loadingMakes ? "Loading makes..." : "Search or select make"
          }
          disabled={loadingMakes}
        />

        <SearchableSelect
          id={`${formData.vehicle_type}_model`}
          label="Model"
          icon={CarFront}
          value={formData.model}
          options={models}
          getOptionValue={(model) => model.vehicle_model_id}
          getOptionLabel={(model) => model.model_name}
          onChange={handleModelChange}
          placeholder={
            !formData.make
              ? "Select make first"
              : loadingModels
                ? "Loading models..."
                : "Search or select model"
          }
          disabled={!formData.make || loadingModels}
        />

        <SearchableSelect
          id={`${formData.vehicle_type}_version`}
          label="Version"
          icon={BadgeCheck}
          value={formData.version}
          options={versions}
          getOptionValue={(version) => version.version_name}
          getOptionLabel={(version) => version.version_name}
          onChange={(selectedVersion) =>
            setFormData((previous) => ({
              ...previous,
              version: selectedVersion,
            }))
          }
          placeholder={
            !formData.model
              ? "Select model first"
              : loadingVersions
                ? "Loading versions..."
                : versions.length === 0
                  ? "No versions available"
                  : "Search or select version"
          }
          disabled={!formData.model || loadingVersions}
        />

        <div className="form-group">
          <label
            htmlFor={`${formData.vehicle_type}_year`}
            className="add-sale-field-label"
          >
            <CalendarDays size={16} aria-hidden="true" />
            <span>Year</span>
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
          <label
            htmlFor={`${formData.vehicle_type}_condition`}
            className="add-sale-field-label"
          >
            <ClipboardCheck size={16} aria-hidden="true" />
            <span>Condition</span>
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
              <option value="re-conditioned">Re-Conditioned</option>
            )}
          </select>
        </div>

        <div className="form-group">
          <label
            htmlFor={`${formData.vehicle_type}_location`}
            className="add-sale-field-label"
          >
            <MapPin size={16} aria-hidden="true" />
            <span>City / Location</span>
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
            className="add-sale-field-label"
          >
            <Building2 size={16} aria-hidden="true" />
            <span>Registration City</span>
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
              <h2 className="add-sale-section-heading">
                <CarFront size={22} aria-hidden="true" />
                <span>Car Basic Information</span>
              </h2>

              <div className="form-group">
                <label htmlFor="car_type" className="add-sale-field-label">
                  <CarFront size={16} aria-hidden="true" />
                  <span>Type</span>
                </label>
                <input
                  id="car_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Sedan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="car_subtype" className="add-sale-field-label">
                  <Layers size={16} aria-hidden="true" />
                  <span>Subtype</span>
                </label>
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

            <CarFields formData={formData} handleChange={handleChange} />
          </>
        );

      case "bike":
        return (
          <>
            <section className="add-sale-section">
              <h2 className="add-sale-section-heading">
                <Bike size={22} aria-hidden="true" />
                <span>Bike Basic Information</span>
              </h2>

              <div className="form-group">
                <label htmlFor="bike_type" className="add-sale-field-label">
                  <Bike size={16} aria-hidden="true" />
                  <span>Type</span>
                </label>
                <input
                  id="bike_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Motorcycle"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bike_subtype" className="add-sale-field-label">
                  <Layers size={16} aria-hidden="true" />
                  <span>Subtype</span>
                </label>
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

            <BikeFields formData={formData} handleChange={handleChange} />
          </>
        );

      case "commercial":
        return (
          <>
            <section className="add-sale-section">
              <h2 className="add-sale-section-heading">
                <Truck size={22} aria-hidden="true" />
                <span>Commercial Basic Information</span>
              </h2>

              <div className="form-group">
                <label
                  htmlFor="commercial_type"
                  className="add-sale-field-label"
                >
                  <Truck size={16} aria-hidden="true" />
                  <span>Vehicle Type</span>
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
                <label
                  htmlFor="commercial_subtype"
                  className="add-sale-field-label"
                >
                  <Layers size={16} aria-hidden="true" />
                  <span>Subtype</span>
                </label>
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
              <h2 className="add-sale-section-heading">
                <Cog size={22} aria-hidden="true" />
                <span>Machinery Basic Information</span>
              </h2>

              <div className="form-group">
                <label
                  htmlFor="machinery_type"
                  className="add-sale-field-label"
                >
                  <Cog size={16} aria-hidden="true" />
                  <span>Machinery Type</span>
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
                <label
                  htmlFor="machinery_subtype"
                  className="add-sale-field-label"
                >
                  <Layers size={16} aria-hidden="true" />
                  <span>Subtype</span>
                </label>
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
              <h2 className="add-sale-section-heading">
                <Sprout size={22} aria-hidden="true" />
                <span>Plant Basic Information</span>
              </h2>

              <div className="form-group">
                <label htmlFor="plant_name" className="add-sale-field-label">
                  <Sprout size={16} aria-hidden="true" />
                  <span>Plant Name</span>
                </label>
                <input
                  id="plant_name"
                  name="plant_name"
                  value={formData.plant_name}
                  onChange={handleChange}
                  placeholder="Enter plant name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="plant_type" className="add-sale-field-label">
                  <Sprout size={16} aria-hidden="true" />
                  <span>Plant Type</span>
                </label>
                <input
                  id="plant_type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="e.g. Power Plant"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="plant_subtype"
                  className="add-sale-field-label"
                >
                  <Layers size={16} aria-hidden="true" />
                  <span>Subtype</span>
                </label>
                <input
                  id="plant_subtype"
                  name="subtype"
                  value={formData.subtype}
                  onChange={handleChange}
                  placeholder="Enter subtype"
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="plant_condition"
                  className="add-sale-field-label"
                >
                  <ClipboardCheck size={16} aria-hidden="true" />
                  <span>Condition</span>
                </label>
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
                <label
                  htmlFor="plant_location"
                  className="add-sale-field-label"
                >
                  <MapPin size={16} aria-hidden="true" />
                  <span>City / Location</span>
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

            <PlantFields formData={formData} handleChange={handleChange} />
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
          <h1 className="add-sale-page-heading">
            <ClipboardList size={28} aria-hidden="true" />
            <span>Add Sale</span>
          </h1>

          <p>
            Select a category and enter the relevant details for your
            advertisement.
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

              <ImageUpload images={images} setImages={setImages} />

              {/* Post Ad Free Card */}
              <section className="post-ad-free-card">
                <div className="post-ad-free-header">
                  <div className="post-ad-free-icon">
                    <BadgeCheck size={28} aria-hidden="true" />
                  </div>

                  <div>
                    <h2>Post Your Ad for Free</h2>
                    <p>
                      You're one step away from listing your vehicle on
                      MotorsCube.
                    </p>
                  </div>
                </div>

                <div className="post-ad-free-benefits">
                  <div>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>Free ad posting</span>
                  </div>

                  <div>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>Up to 30 vehicle images</span>
                  </div>

                  <div>
                    <CheckCircle2 size={18} aria-hidden="true" />
                    <span>Showcase your vehicle to potential buyers</span>
                  </div>
                </div>

                <div className="post-ad-free-footer">
                  <span className="post-ad-free-price">Free</span>

                  <button
                    type="submit"
                    className="post-ad-free-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Posting Your Ad..."
                    ) : (
                      <>
                        <BadgeCheck size={18} aria-hidden="true" />
                        Post Ad Free
                      </>
                    )}
                  </button>
                </div>
              </section>
            </>
          )}
        </form>
      </main>
    </>
  );
}

export default AddSale;
