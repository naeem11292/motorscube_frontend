
import { useState } from "react";
import axios from "../../api/axios";
import HireHero from "../../components/AddHire/HireHero";
import {
  CarFront,
  Bike,
  Truck,
  Cog,
  Sprout,
  ClipboardList,
  MapPin,
  CalendarDays,
  ImagePlus,
  X,
  FileText,
  CreditCard,
} from "lucide-react";
import "./AddHire.css";

const categories = [
  { value: "car", label: "Car", Icon: CarFront },
  { value: "bike", label: "Bike", Icon: Bike },
  { value: "commercial", label: "Commercial", Icon: Truck },
  { value: "machinery", label: "Machinery", Icon: Cog },
  { value: "plant", label: "Plant", Icon: Sprout },
];

const initialFormData = {
  vehicle_type: "car",
  type: "",
  subtype: "",
  condition: "",
  make: "",
  model: "",
  version: "",
  year: "",
  registration_city: "",
  location: "",
  country: "Pakistan",
  mileage: "",
  charges: "",
  charges_type: "daily",
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
  weight: "",
  plant_name: "",
  parameter_type: "",
  dimensions: "",
  serial_no: "",
  hours_used: "",
  description: "",
};

const fieldsByCategory = {
  car: [
    ["type", "Vehicle Type", "e.g. Sedan"],
    ["subtype", "Subtype", "e.g. Compact Sedan"],
    ["make", "Make", "Enter make"],
    ["model", "Model", "Enter model"],
    ["version", "Version", "Enter version"],
    ["year", "Year", "e.g. 2024", "number"],
    ["condition", "Condition", "select"],
    ["mileage", "Mileage (km)", "Enter mileage", "number"],
    ["registration_city", "Registration City", "Enter city"],
    ["location", "Current Location", "Enter location"],
    ["body_type", "Body Type", "e.g. SUV"],
    ["color", "Color", "Enter color"],
    ["transmission", "Transmission", "select-transmission"],
    ["fuel_type", "Fuel Type", "select-fuel"],
    ["engine_size", "Engine Size (cc)", "Enter engine size", "number"],
    ["doors", "Doors", "e.g. 4", "number"],
  ],
  bike: [
    ["type", "Bike Type", "e.g. Motorcycle"],
    ["subtype", "Subtype", "e.g. Sports Bike"],
    ["make", "Make", "Enter make"],
    ["model", "Model", "Enter model"],
    ["version", "Version", "Enter version"],
    ["year", "Year", "e.g. 2024", "number"],
    ["condition", "Condition", "select"],
    ["mileage", "Mileage (km)", "Enter mileage", "number"],
    ["registration_city", "Registration City", "Enter city"],
    ["location", "Current Location", "Enter location"],
    ["engine_size", "Engine Size (cc)", "Enter engine size", "number"],
    ["engine_type", "Engine Type", "e.g. 4-stroke"],
  ],
  commercial: [
    ["type", "Vehicle Type", "e.g. Truck, Bus"],
    ["subtype", "Subtype", "Enter subtype"],
    ["make", "Make", "Enter make"],
    ["model", "Model", "Enter model"],
    ["version", "Version", "Enter version"],
    ["year", "Year", "e.g. 2024", "number"],
    ["condition", "Condition", "select"],
    ["mileage", "Mileage (km)", "Enter mileage", "number"],
    ["registration_city", "Registration City", "Enter city"],
    ["location", "Current Location", "Enter location"],
    ["weight", "Weight", "Enter weight"],
    ["fuel_type", "Fuel Type", "select-fuel"],
    ["transmission", "Transmission", "select-transmission"],
  ],
  machinery: [
    ["type", "Machinery Type", "e.g. Construction Machinery"],
    ["subtype", "Subtype", "e.g. Excavator"],
    ["make", "Make", "Enter make"],
    ["model", "Model", "Enter model"],
    ["version", "Version", "Enter version"],
    ["year", "Year", "e.g. 2024", "number"],
    ["condition", "Condition", "select"],
    ["hours_used", "Hours Used", "Enter hours", "number"],
    ["location", "Current Location", "Enter location"],
    ["weight", "Weight", "Enter weight"],
    ["serial_no", "Serial Number", "Enter serial number"],
    ["dimensions", "Dimensions", "Enter dimensions"],
  ],
  plant: [
    ["plant_name", "Plant Name", "Enter plant name"],
    ["type", "Plant Type", "e.g. Power Plant"],
    ["subtype", "Subtype", "Enter subtype"],
    ["year", "Year", "e.g. 2024", "number"],
    ["condition", "Condition", "select"],
    ["hours_used", "Hours Used", "Enter hours", "number"],
    ["location", "Current Location", "Enter location"],
    ["parameter_type", "Parameter Type", "Enter parameter type"],
    ["dimensions", "Dimensions", "Enter dimensions"],
    ["serial_no", "Serial Number", "Enter serial number"],
  ],
};

function formatLabel(value) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AddHire() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData((previous) => ({
      ...initialFormData,
      vehicle_type: category,
      country: previous.country || "Pakistan",
    }));
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = 30 - images.length;

    if (selectedFiles.length > remainingSlots) {
      alert(`You can upload up to 30 images. ${remainingSlots} slot(s) remaining.`);
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(`${file.name} is not supported. Use JPG, PNG, or WebP.`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5 MB per-image limit.`);
        return false;
      }

      return true;
    });

    setImages((previous) => [
      ...previous,
      ...validFiles.slice(0, Math.max(0, remainingSlots)),
    ]);

    // Allow selecting the same file again after removing it.
    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  const renderField = ([name, label, placeholder, type = "text"]) => {
    const id = `hire-${name}`;

    return (
      <div className="form-group" key={name}>
        <label className="add-sale-field-label" htmlFor={id}>
          {name === "location" ? (
            <MapPin size={16} aria-hidden="true" />
          ) : name === "year" ? (
            <CalendarDays size={16} aria-hidden="true" />
          ) : null}
          <span>{label}</span>
        </label>

        {placeholder === "select" ? (
          <select
            id={id}
            name={name}
            value={formData[name]}
            onChange={handleChange}
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            {formData.vehicle_type === "bike" && (
              <option value="re-conditioned">Re-Conditioned</option>
            )}
          </select>
        ) : placeholder === "select-transmission" ? (
          <select
            id={id}
            name={name}
            value={formData[name]}
            onChange={handleChange}
          >
            <option value="">Select transmission</option>
            <option value="automatic">Automatic</option>
            <option value="manual">Manual</option>
          </select>
        ) : placeholder === "select-fuel" ? (
          <select
            id={id}
            name={name}
            value={formData[name]}
            onChange={handleChange}
          >
            <option value="">Select fuel type</option>
            <option value="petrol">Petrol</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">Hybrid</option>
            <option value="electric">Electric</option>
            <option value="cng">CNG</option>
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            min={type === "number" ? "0" : undefined}
            value={formData[name]}
            onChange={handleChange}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.vehicle_type) {
      alert("Please select a vehicle category.");
      return;
    }

    if (!formData.charges || Number(formData.charges) <= 0) {
      alert("Please enter valid rental charges.");
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

      const response = await axios.post("/items-ad-hire/", payload);

      console.log("Hire ad created:", response.data);
      alert("Hire advertisement submitted successfully.");
    } catch (error) {
      console.error(
        "Create hire error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to submit the hire advertisement. Check the API route and required fields."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HireHero />

      <main className="add-sale-page add-hire-page">
        <div className="add-sale-header">
          <h1 className="add-sale-page-heading">
            <ClipboardList size={28} aria-hidden="true" />
            <span>Add Hire</span>
          </h1>

          <p>
            List your vehicle or equipment for rent by entering its details,
            rental charges, and images.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <section className="sale-form-section add-sale-section">
            <h2 className="add-sale-section-heading">
              <CarFront size={22} aria-hidden="true" />
              <span>Select Vehicle Category</span>
            </h2>

            <div className="hire-category-grid">
              {categories.map(({ value, label, Icon }) => (
                <button
                  type="button"
                  key={value}
                  className={`hire-category-button ${
                    formData.vehicle_type === value ? "active" : ""
                  }`}
                  aria-pressed={formData.vehicle_type === value}
                  onClick={() => handleCategoryChange(value)}
                >
                  <Icon size={25} aria-hidden="true" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <ClipboardList size={22} aria-hidden="true" />
              <span>
                {categories.find(
                  (category) => category.value === formData.vehicle_type
                )?.label || "Vehicle"}{" "}
                Basic Information
              </span>
            </h2>

            <div className="add-sale-fields-grid">
              {fieldsByCategory[formData.vehicle_type].map(renderField)}
            </div>
          </section>

          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <CreditCard size={22} aria-hidden="true" />
              <span>Rental Information</span>
            </h2>

            <div className="add-sale-fields-grid">
              <div className="form-group">
                <label className="add-sale-field-label" htmlFor="hire-charges">
                  Rental Charges (PKR)
                </label>
                <input
                  id="hire-charges"
                  name="charges"
                  type="number"
                  min="1"
                  value={formData.charges}
                  onChange={handleChange}
                  placeholder="Enter rental price"
                  required
                />
              </div>

              <div className="form-group">
                <label
                  className="add-sale-field-label"
                  htmlFor="hire-charges-type"
                >
                  Charging Period
                </label>
                <select
                  id="hire-charges-type"
                  name="charges_type"
                  value={formData.charges_type}
                  onChange={handleChange}
                  required
                >
                  <option value="hourly">Per hour</option>
                  <option value="daily">Per day</option>
                  <option value="weekly">Per week</option>
                  <option value="monthly">Per month</option>
                </select>
              </div>
            </div>
          </section>

          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <FileText size={22} aria-hidden="true" />
              <span>Description and Features</span>
            </h2>

            <div className="form-group">
              <label
                className="add-sale-field-label"
                htmlFor="hire-features"
              >
                Features
              </label>
              <input
                id="hire-features"
                name="features"
                value={formData.features}
                onChange={handleChange}
                placeholder="e.g. Air conditioning, GPS, driver available"
              />
            </div>

            <div className="form-group">
              <label
                className="add-sale-field-label"
                htmlFor="hire-description"
              >
                Description
              </label>
              <textarea
                id="hire-description"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the vehicle, rental conditions, and availability..."
              />
            </div>
          </section>

          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <ImagePlus size={22} aria-hidden="true" />
              <span>Vehicle Images</span>
            </h2>

            <div className="hire-image-upload">
              <label htmlFor="hire-images" className="hire-image-picker">
                <ImagePlus size={30} aria-hidden="true" />
                <strong>Upload vehicle images</strong>
                <span>JPG, PNG, or WebP · Maximum 5 MB per image</span>
                <span>{images.length} of 30 images selected</span>
              </label>

              <input
                id="hire-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                disabled={images.length >= 30}
              />
            </div>

            {images.length > 0 && (
              <div className="hire-image-grid">
                {images.map((image, index) => (
                  <div className="hire-image-preview" key={`${image.name}-${index}`}>
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Vehicle preview ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="hire-submit-actions">
            <button
              type="submit"
              className="free-ad-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting Hire Ad..." : "Submit Hire Ad"}
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
