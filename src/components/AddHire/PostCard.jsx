
import { useState, useEffect } from "react";
import "./PostCard.css";

const packages = [
  {
    value: "normal",
    name: "Normal",
    description: "Publish a regular advertisement.",
  },
  {
    value: "hotspot",
    name: "Hot Spot",
    description: "Give your advertisement extra visibility.",
  },
  {
    value: "supreme",
    name: "Supreme",
    description: "Promote your advertisement with premium visibility.",
  },
];

function PostCard({ value = "normal", onChange }) {
  const [selectedPackage, setSelectedPackage] = useState(value);

  useEffect(() => {
    setSelectedPackage(value);
  }, [value]);

  const handleSelect = (plan) => {
    setSelectedPackage(plan);
    onChange?.(plan);
  };

  return (
    <section className="post-card">
      <div className="post-card-left">
        <div className="post-card-heading">
          <h2>Choose Advertisement Type</h2>
          <p>Select how your advertisement should appear in listings.</p>
        </div>

        <div className="post-card-packages">
          {packages.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={selectedPackage === item.value}
              className={`post-card-package ${
                selectedPackage === item.value ? "selected" : ""
              }`}
              onClick={() => handleSelect(item.value)}
            >
              <span className="post-card-package-name">{item.name}</span>
              <span className="post-card-description">
                {item.description}
              </span>
              <span className="post-card-price">No payment for now</span>
              <span className="post-card-select-label">
                {selectedPackage === item.value ? "Selected ✓" : "Select option →"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="post-card-right">
        <div className="post-card-payment">
          <div className="post-card-selected-heading">
            <span className="post-card-eyebrow">SELECTED LISTING TYPE</span>
            <h3>
              {packages.find((item) => item.value === selectedPackage)?.name}
            </h3>
            <p>
              {
                packages.find((item) => item.value === selectedPackage)
                  ?.description
              }
            </p>
            <div className="post-card-selected-price">
              Payment not required
            </div>
          </div>

          <p className="post-card-note">
            Your selected advertisement type will be saved with your listing.
            Payment functionality can be added later.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PostCard;
