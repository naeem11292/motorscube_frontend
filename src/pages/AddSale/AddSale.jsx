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

    // Description
    description: "",

    // Machinery / Plant
    weight: "",
    plant_name: "",
    parameter_type: "",
    dimensions: "",
    serial_no: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        ...formData,

        year:
          formData.year !== ""
            ? Number(formData.year)
            : undefined,

        mileage:
          formData.mileage !== ""
            ? Number(formData.mileage)
            : undefined,

        price:
          formData.price !== ""
            ? Number(formData.price)
            : undefined,

        serial_no:
          formData.serial_no !== ""
            ? Number(formData.serial_no)
            : undefined,
      };

      console.log("Vehicle Type:", formData.vehicle_type);
      console.log("Complete Form Data:", formData);
      console.log("Sale Payload:", payload);
      console.log(
        "Vehicle Type Being Sent:",
        payload.vehicle_type
      );
      console.log("Selected Images:", images);

      const response = await createSaleAd(payload);

      console.log("Sale created:", response);

      alert("Sale ad created successfully!");
    } catch (error) {
      console.error("Create sale error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create sale ad"
      );
    }
  };

  return (
    <>
      {/* Sell Hero */}
      <SellHero />

      {/* Add Sale Form */}
      <div className="add-sale-page">
        <h1>Add Sale</h1>

        <form onSubmit={handleSubmit}>
          {/* Vehicle Type */}
          <VehicleTypeSelector
            value={formData.vehicle_type}
            onChange={(event) =>
              setFormData((previous) => ({
                ...previous,
                vehicle_type: event.target.value,
              }))
            }
          />

          {/* Vehicle-specific fields */}

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

          {/* Common sections */}

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

          {/* Images */}

          <ImageUpload
            images={images}
            setImages={setImages}
          />

          <button type="submit">
            Continue
          </button>
        </form>
      </div>
    </>
  );
}

export default AddSale;