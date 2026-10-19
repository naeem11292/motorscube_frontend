
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import HireHero from "../../components/AddHire/HireHero";
import CommercialFields from "../../components/AddHire/CommercialFields";
import Description from "../../components/AddHire/Description";
import PostCard from "../../components/AddSale/PostCard";
import SearchableSelect from "../../components/AddSale/SearchableSelect";
import ImageUpload from "../../components/AddSale/ImageUpload";
import {
  CarFront,
  Bike,
  Truck,
  Cog,
  Sprout,
  ClipboardList,
  Factory,
  BadgeCheck,
  CalendarDays,
  MapPin,
  Building2,
  ClipboardCheck,
  
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

function AddHire() {
  const [formData, setFormData] = useState(initialFormData);
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [versions, setVersions] = useState([]);

  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingVersions, setLoadingVersions] = useState(false);

  const [postingOption, setPostingOption] = useState("");
  const [freeHireConfirmed, setFreeHireConfirmed] = useState(false);

  // Load makes for the selected category.
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

  // Load models after a make is selected.
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
        const list = Array.isArray(data) ? data : [];

        setModels(
          list.filter(
            (item) =>
              String(item.vehicle_make_id) === String(formData.make)
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

  // Load versions after a model is selected.
  useEffect(() => {
    let cancelled = false;

    const fetchVersions = async () => {
      setVersions([]);

      if (!formData.model) {
        setLoadingVersions(false);
        return;
      }

      try {
        setLoadingVersions(true);

        const response = await axios.get(
          `/version/model/${formData.model}`
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
        if (!cancelled) {
          setLoadingVersions(false);
        }
      }
    };

    fetchVersions();

    return () => {
      cancelled = true;
    };
  }, [formData.model]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData({
      ...initialFormData,
      vehicle_type: category,
    });

    setMakes([]);
    setModels([]);
    setVersions([]);
  };

  const handleMakeChange = (makeId) => {
    setFormData((previous) => ({
      ...previous,
      make: String(makeId),
      model: "",
      version: "",
    }));

    setModels([]);
    setVersions([]);
  };

  const handleModelChange = (modelId) => {
    setFormData((previous) => ({
      ...previous,
      model: String(modelId),
      version: "",
    }));

    setVersions([]);
  };

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = Math.max(0, 30 - images.length);

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const validFiles = selectedFiles.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        alert(
          `${file.name} is not supported. Use JPG, PNG, or WebP.`
        );
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5 MB per-image limit.`);
        return false;
      }

      return true;
    });

    if (validFiles.length > remainingSlots) {
      alert(
        `You can upload up to 30 images. ${remainingSlots} slot(s) remaining.`
      );
    }

    setImages((previous) => [
      ...previous,
      ...validFiles.slice(0, remainingSlots),
    ]);

    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  const renderInput = (
    name,
    label,
    placeholder,
    type = "text",
    Icon = null
  ) => (
    <div className="form-group" key={name}>
      <label
        htmlFor={`hire-${name}`}
        className="add-sale-field-label"
      >
        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
        <span>{label}</span>
      </label>

      <input
        id={`hire-${name}`}
        name={name}
        type={type}
        min={type === "number" ? "0" : undefined}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );

  const renderSelect = (name, label, options, Icon = null) => (
    <div className="form-group" key={name}>
      <label
        htmlFor={`hire-${name}`}
        className="add-sale-field-label"
      >
        {Icon ? <Icon size={16} aria-hidden="true" /> : null}
        <span>{label}</span>
      </label>

      <select
        id={`hire-${name}`}
        name={name}
        value={formData[name]}
        onChange={handleChange}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  const renderCommonFields = () => (
    <>
      <SearchableSelect
        id="hire-make"
        label="Make"
        icon={Factory}
        value={formData.make}
        options={makes}
        getOptionValue={(item) => item.vehicle_make_id}
        getOptionLabel={(item) => item.make_name}
        onChange={handleMakeChange}
        placeholder={
          loadingMakes ? "Loading makes..." : "Search or select make"
        }
        disabled={!formData.vehicle_type || loadingMakes}
      />

      <SearchableSelect
        id="hire-model"
        label="Model"
        icon={CarFront}
        value={formData.model}
        options={models}
        getOptionValue={(item) => item.vehicle_model_id}
        getOptionLabel={(item) => item.model_name}
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
        id="hire-version"
        label="Version"
        icon={BadgeCheck}
        value={formData.version}
        options={versions}
        getOptionValue={(item) => item.version_name}
        getOptionLabel={(item) => item.version_name}
        onChange={(value) =>
          setFormData((previous) => ({
            ...previous,
            version: value,
          }))
        }
        placeholder={
          !formData.model
            ? "Select model first"
            : loadingVersions
              ? "Loading versions..."
              : versions.length
                ? "Search or select version"
                : "No versions available"
        }
        disabled={!formData.model || loadingVersions}
      />

      {renderInput("year", "Year", "e.g. 2024", "number", CalendarDays)}

      {renderSelect(
        "condition",
        "Condition",
        [
          { value: "", label: "Select condition" },
          { value: "new", label: "New" },
          { value: "used", label: "Used" },
          ...(formData.vehicle_type === "bike"
            ? [
                {
                  value: "re-conditioned",
                  label: "Re-Conditioned",
                },
              ]
            : []),
        ],
        ClipboardCheck
      )}

      {renderInput(
        "location",
        "City / Location",
        "Enter current location",
        "text",
        MapPin
      )}

      {!["machinery", "plant"].includes(formData.vehicle_type) &&
        renderInput(
          "registration_city",
          "Registration City",
          "Enter registration city",
          "text",
          Building2
        )}
    </>
  );

  const renderCategoryDetails = () => {
    switch (formData.vehicle_type) {
      case "car":
        return (
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <CarFront size={22} aria-hidden="true" />
              <span>Car Details</span>
            </h2>

            <div className="add-sale-fields-grid">
              {renderInput("type", "Vehicle Type", "e.g. Sedan")}
              {renderInput("subtype", "Subtype", "e.g. Compact Sedan")}
              {renderInput("body_type", "Body Type", "e.g. SUV")}
              {renderInput("color", "Color", "Enter color")}

              {renderSelect("transmission", "Transmission", [
                { value: "", label: "Select transmission" },
                { value: "automatic", label: "Automatic" },
                { value: "manual", label: "Manual" },
              ])}

              {renderSelect("fuel_type", "Fuel Type", [
                { value: "", label: "Select fuel type" },
                { value: "petrol", label: "Petrol" },
                { value: "diesel", label: "Diesel" },
                { value: "hybrid", label: "Hybrid" },
                { value: "electric", label: "Electric" },
                { value: "cng", label: "CNG" },
              ])}

              {renderInput(
                "mileage",
                "Mileage (km)",
                "Enter mileage",
                "number"
              )}

              {renderInput(
                "engine_size",
                "Engine Size (cc)",
                "Enter engine size",
                "number"
              )}

              {renderInput("doors", "Doors", "e.g. 4", "number")}
            </div>
          </section>
        );

      case "bike":
        return (
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <Bike size={22} aria-hidden="true" />
              <span>Bike Details</span>
            </h2>

            <div className="add-sale-fields-grid">
              {renderInput("type", "Bike Type", "e.g. Motorcycle")}
              {renderInput("subtype", "Subtype", "e.g. Sports Bike")}

              {renderInput(
                "mileage",
                "Mileage (km)",
                "Enter mileage",
                "number"
              )}

              {renderInput(
                "engine_size",
                "Engine Size (cc)",
                "Enter engine size",
                "number"
              )}

              {renderInput(
                "engine_type",
                "Engine Type",
                "e.g. 4-stroke"
              )}
            </div>
          </section>
        );

      case "commercial":
        return (
          <>
            <CommercialFields
              formData={formData}
              handleChange={handleChange}
            />

            <section className="add-sale-section">
              <h2 className="add-sale-section-heading">
                <Truck size={22} aria-hidden="true" />
                <span>Additional Commercial Details</span>
              </h2>

              <div className="add-sale-fields-grid">
                {renderInput("type", "Vehicle Type", "e.g. Truck, Bus")}
                {renderInput("subtype", "Subtype", "Enter subtype")}

                {renderInput(
                  "mileage",
                  "Mileage (km)",
                  "Enter mileage",
                  "number"
                )}

                {renderInput("weight", "Weight", "Enter weight")}

                {renderSelect("transmission", "Transmission", [
                  { value: "", label: "Select transmission" },
                  { value: "automatic", label: "Automatic" },
                  { value: "manual", label: "Manual" },
                ])}
              </div>
            </section>
          </>
        );

      case "machinery":
        return (
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <Cog size={22} aria-hidden="true" />
              <span>Machinery Details</span>
            </h2>

            <div className="add-sale-fields-grid">
              {renderInput(
                "type",
                "Machinery Type",
                "e.g. Construction Machinery"
              )}

              {renderInput("subtype", "Subtype", "e.g. Excavator")}

              {renderInput(
                "hours_used",
                "Hours Used",
                "Enter hours used",
                "number"
              )}

              {renderInput("weight", "Weight", "Enter weight")}
              {renderInput("serial_no", "Serial Number", "Enter serial number")}
              {renderInput("dimensions", "Dimensions", "Enter dimensions")}
            </div>
          </section>
        );

      case "plant":
        return (
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <Sprout size={22} aria-hidden="true" />
              <span>Plant Details</span>
            </h2>

            <div className="add-sale-fields-grid">
              {renderInput("plant_name", "Plant Name", "Enter plant name")}
              {renderInput("type", "Plant Type", "e.g. Power Plant")}
              {renderInput("subtype", "Subtype", "Enter subtype")}

              {renderInput(
                "hours_used",
                "Hours Used",
                "Enter hours used",
                "number"
              )}

              {renderInput(
                "parameter_type",
                "Parameter Type",
                "Enter parameter type"
              )}

              {renderInput("dimensions", "Dimensions", "Enter dimensions")}
              {renderInput("serial_no", "Serial Number", "Enter serial number")}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const handlePostCardPayment = ({
    packageName,
    paymentType,
    provider,
    amount,
  }) => {
    // Payment processing must be verified by the backend.
    console.log("Hire ad payment selection:", {
      packageName,
      paymentType,
      provider,
      amount,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (postingOption !== "free") {
      alert("Please select Add Free to submit a free hire advertisement.");
      return;
    }

    if (!freeHireConfirmed) {
      alert("Please confirm that you want to post this hire advertisement for free.");
      return;
    }

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
          {/* Vehicle category */}
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

          {/* Basic and category-specific information */}
          {formData.vehicle_type && (
            <>
              <section className="add-sale-section">
                <h2 className="add-sale-section-heading">
                  <ClipboardList size={22} aria-hidden="true" />
                  <span>
                    {
                      categories.find(
                        (item) => item.value === formData.vehicle_type
                      )?.label
                    }{" "}
                    Basic Information
                  </span>
                </h2>

                <div className="add-sale-fields-grid">
                  {renderCommonFields()}
                </div>
              </section>

              {renderCategoryDetails()}
            </>
          )}

          {/* Rental information */}
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <CreditCard size={22} aria-hidden="true" />
              <span>Rental Information</span>
            </h2>

            <div className="add-sale-fields-grid">
              <div className="form-group">
                <label
                  className="add-sale-field-label"
                  htmlFor="hire-charges"
                >
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

          {/* Features */}
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <FileText size={22} aria-hidden="true" />
              <span>Features</span>
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
          </section>

          <Description
            formData={formData}
            handleChange={handleChange}
          />
            {/* Images */}
            <ImageUpload images={images} setImages={setImages} />

          {/* Posting options at the end of the form */}
          <section className="add-sale-section">
            <h2 className="add-sale-section-heading">
              <CreditCard size={22} aria-hidden="true" />
              <span>Choose Posting Option</span>
            </h2>

            <div className="hire-posting-options-grid">
              <button
                type="button"
                className={`hire-posting-option ${
                  postingOption === "free" ? "active" : ""
                }`}
                aria-pressed={postingOption === "free"}
                onClick={() => {
                  setPostingOption("free");
                  setFreeHireConfirmed(false);
                }}
              >
                <BadgeCheck size={26} aria-hidden="true" />
                <strong>Add Free</strong>
                <span>Post your hire advertisement for free.</span>
              </button>

              <button
                type="button"
                className={`hire-posting-option ${
                  postingOption === "paid" ? "active" : ""
                }`}
                aria-pressed={postingOption === "paid"}
                onClick={() => setPostingOption("paid")}
              >
                <CreditCard size={26} aria-hidden="true" />
                <strong>Post Ad</strong>
                <span>Choose a promotion package and payment option.</span>
              </button>
            </div>
          </section>

          {/* Free posting confirmation and submission */}
          {postingOption === "free" && (
            <section className="add-sale-section free-hire-confirmation">
              <label className="free-ad-checkbox">
                <input
                  type="checkbox"
                  checked={freeHireConfirmed}
                  onChange={(event) =>
                    setFreeHireConfirmed(event.target.checked)
                  }
                />

                <span>
                  I confirm that I want to post this hire advertisement
                  for free.
                </span>
              </label>

              <div className="hire-submit-actions">
                <button
                  type="submit"
                  className="free-ad-submit-btn"
                  disabled={
                    isSubmitting ||
                    !formData.vehicle_type ||
                    !formData.charges ||
                    Number(formData.charges) <= 0 ||
                    !freeHireConfirmed
                  }
                >
                  {isSubmitting
                    ? "Submitting Hire Ad..."
                    : "Post Hire Ad Free"}
                </button>
              </div>
            </section>
          )}

          {/* Paid posting */}
          {postingOption === "paid" && (
            <PostCard
              walletBalance={0}
              isLoadingWallet={false}
              onPayment={handlePostCardPayment}
            />
          )}
        </form>
      </main>
    </>
  );
}

export default AddHire;
