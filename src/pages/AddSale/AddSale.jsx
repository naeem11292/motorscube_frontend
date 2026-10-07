import { useState } from "react";
import { createSaleAd } from "../../api/itemsAdSale.api";

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

    // Images
    image_1: null,
    image_2: null,
    image_3: null,
    image_4: null,
    image_5: null,
    image_6: null,
    image_7: null,
    image_8: null,

    // Machinery / Plant
    weight: "",
    plant_name: "",
    parameter_type: "",
    dimensions: "",
    serial_no: "",
  });

  // Handles all text, number, select and file inputs
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: files ? files[0] : value,
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

      // Images are not being uploaded yet.
      // Remove image fields from the JSON request.
      for (let i = 1; i <= 8; i++) {
        delete payload[`image_${i}`];
      }

      console.log("Sale Payload:", payload);

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

        <ImageUpload
          formData={formData}
          handleChange={handleChange}
        />

        <button type="submit">
          Continue
        </button>

      </form>
    </div>
  );
}

export default AddSale;