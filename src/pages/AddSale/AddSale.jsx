
import { useState } from "react";
import { createSaleAd } from "../../api/itemsAdSale.api";
import SellHero from "../../components/AddSale/SellHero";

import VehicleTypeSelector from "../../components/AddSale/VehicleTypeSelector";
import BasicInformation from "../../components/AddSale/BasicInformation";
import LocationInformation from "../../components/AddSale/LocationInformation";
import VehicleDetails from "../../components/AddSale/VehicleDetails";
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

  const [formData, setFormData] = useState({
    // Vehicle Type
    vehicle_type: "",

    // Basic Information
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

    // Vehicle Details
    mileage: "",
    price: "",
    body_type: "",
    color: "",
    transmission: "",
    fuel_type: "",
    engine_size: "",
    doors: "",
    wheels_power: "",

    // Ad Information
    user_type: "",
    ad_type: "",
    post_status: "",

    // Machinery / Plant
    weight: "",
    plant_name: "",
    parameter_type: "",
    dimensions: "",
    serial_no: "",
  });

  // Handle changes in all form fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Handle vehicle category button selection
  const handleVehicleTypeChange = (event) => {
    const selectedType = event.target.value;

    setFormData((previous) => ({
      ...previous,
      vehicle_type: selectedType,
    }));
  };

  // Submit sale advertisement
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.vehicle_type) {
      alert("Please select a vehicle type.");
      return;
    }

    if (images.length > 30) {
      alert("You can upload a maximum of 30 images.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      // Add images
      images.forEach((image) => {
        payload.append("images", image);
      });

      console.log("Sale form data:", formData);
      console.log("Selected images:", images);
      console.log("Image count:", images.length);

      // Call existing sale API
      const response = await createSaleAd(payload);

      console.log("Sale created:", response);

      alert("Sale ad created successfully!");
    } catch (error) {
      console.error("Create sale error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create sale ad. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sale Hero */}
      <SellHero />

      {/* Add Sale Page */}
      <main className="add-sale-page">
        <div className="add-sale-header">
          <h1>Add Sale</h1>
          <p>
            Enter your vehicle details to create a sale advertisement.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Select Vehicle Type */}
          <section className="sale-form-section">
            <VehicleTypeSelector
              value={formData.vehicle_type}
              onChange={handleVehicleTypeChange}
            />
          </section>

          {/* Step 2: Show selected vehicle fields */}
          {formData.vehicle_type === "car" && (
            <CarFields
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {formData.vehicle_type === "bike" && (
            <BikeFields
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {formData.vehicle_type === "commercial" && (
            <CommercialFields
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {formData.vehicle_type === "machinery" && (
            <MachineryFields
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {formData.vehicle_type === "plant" && (
            <PlantFields
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {/* Step 3: Common Information */}
          <BasicInformation
            formData={formData}
            handleChange={handleChange}
          />

          <LocationInformation
            formData={formData}
            handleChange={handleChange}
          />

          <VehicleDetails
            formData={formData}
            handleChange={handleChange}
          />

          <AdInformation
            formData={formData}
            handleChange={handleChange}
          />

          <Description
            formData={formData}
            handleChange={handleChange}
          />

          {/* Step 4: Upload Images */}
          <ImageUpload
            images={images}
            setImages={setImages}
          />

          {/* Submit Sale Advertisement */}
          <div className="add-sale-submit">
            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Continue"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default AddSale;
