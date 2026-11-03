
import { useEffect, useMemo, useState } from "react";
import "./MoreFilters.css";

const FILTER_GROUPS = [
  {
    key: "condition",
    title: "Car Condition",
    field: "condition",
    options: ["New", "Used", "Re-conditioned"],
  },
  {
    key: "city",
    title: "City",
    field: "city",
  },
  {
    key: "registrationCity",
    title: "Registration City",
    field: "registration_city",
  },
  {
    key: "make",
    title: "Make",
    field: "make",
  },
  {
    key: "model",
    title: "Model",
    field: "model",
  },
  {
    key: "version",
    title: "Version",
    field: "version",
  },
  {
    key: "fuelType",
    title: "Fuel Type",
    field: "fuel_type",
    options: ["Petrol", "Diesel", "Hybrid", "Electric", "CNG"],
  },
  {
    key: "bodyType",
    title: "Body Type",
    field: "body_type",
  },
  {
    key: "transmission",
    title: "Transmission",
    field: "transmission",
    options: ["Automatic", "Manual"],
  },
  {
    key: "engineType",
    title: "Engine Type",
    field: "engine_type",
  },
  {
    key: "color",
    title: "Color",
    field: "color",
  },
  {
    key: "adType",
    title: "Ad Type",
    field: "ad_type",
  },
];

const getUniqueValues = (listings, field) => {
  return [
    ...new Set(
      listings
        .map((item) => item[field])
        .filter((value) => value !== null && value !== undefined && value !== "")
        .map((value) => String(value))
    ),
  ].sort((a, b) => a.localeCompare(b));
};

const MoreFilters = ({
  open,
  onClose,
  listings = [],
  filters,
  onApply,
  onClear,
}) => {
  const [draft, setDraft] = useState(filters);

  useEffect(() => {
    if (open) {
      setDraft(filters);
    }
  }, [open, filters]);

  const yearValues = listings
    .map((item) => Number(item.year))
    .filter((value) => Number.isFinite(value) && value > 0);

  const priceValues = listings
    .map((item) => Number(item.display_price))
    .filter((value) => Number.isFinite(value) && value >= 0);

  const minYear = yearValues.length ? Math.min(...yearValues) : 1990;
  const maxYear = yearValues.length ? Math.max(...yearValues) : 2026;

  const minAvailablePrice = priceValues.length
    ? Math.min(...priceValues)
    : 0;

  const maxAvailablePrice = priceValues.length
    ? Math.max(...priceValues)
    : 10000000;

  const updateFilter = (key, value) => {
    setDraft((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const toggleChip = (key, value) => {
    const current = draft[key] || [];

    updateFilter(
      key,
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const dynamicOptions = useMemo(() => {
    return FILTER_GROUPS.reduce((result, group) => {
      result[group.key] =
        group.options || getUniqueValues(listings, group.field);

      return result;
    }, {});
  }, [listings]);

  if (!open) return null;

  const renderChipGroup = (group) => {
    const options = dynamicOptions[group.key] || [];

    if (!options.length) return null;

    return (
      <div className="mf-group" key={group.key}>
        <h4>{group.title}</h4>

        <div className="mf-chips">
          {options.map((option) => {
            const selected = (draft[group.key] || []).includes(option);

            return (
              <button
                key={option}
                type="button"
                className={`mf-chip ${selected ? "selected" : ""}`}
                onClick={() => toggleChip(group.key, option)}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="mf-backdrop" onClick={onClose} />

      <aside
        className="mf-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="All filters"
      >
        <div className="mf-header">
          <div>
            <h3>All Filters</h3>
            <p>Refine your search</p>
          </div>

          <button
            type="button"
            className="mf-close"
            onClick={onClose}
            aria-label="Close filters"
          >
            ×
          </button>
        </div>

        <div className="mf-content">
          {FILTER_GROUPS.slice(0, 6).map(renderChipGroup)}

          {/* YEAR RANGE */}
          <div className="mf-group">
            <h4>Year</h4>

            <div className="mf-range-labels">
              <span>{draft.yearMin || minYear}</span>
              <span>{draft.yearMax || maxYear}</span>
            </div>

            <div className="mf-range-inputs">
              <input
                type="range"
                min={minYear}
                max={maxYear}
                value={draft.yearMin || minYear}
                onChange={(event) =>
                  updateFilter(
                    "yearMin",
                    Math.min(Number(event.target.value), Number(draft.yearMax || maxYear))
                  )
                }
              />

              <input
                type="range"
                min={minYear}
                max={maxYear}
                value={draft.yearMax || maxYear}
                onChange={(event) =>
                  updateFilter(
                    "yearMax",
                    Math.max(Number(event.target.value), Number(draft.yearMin || minYear))
                  )
                }
              />
            </div>
          </div>

          {/* PRICE RANGE */}
          <div className="mf-group">
            <h4>Price Range</h4>

            <div className="mf-range-labels">
              <span>
                PKR {Number(draft.priceMin || minAvailablePrice).toLocaleString("en-PK")}
              </span>
              <span>
                PKR {Number(draft.priceMax || maxAvailablePrice).toLocaleString("en-PK")}
              </span>
            </div>

            <div className="mf-range-inputs">
              <input
                type="range"
                min={minAvailablePrice}
                max={maxAvailablePrice}
                step="10000"
                value={draft.priceMin || minAvailablePrice}
                onChange={(event) =>
                  updateFilter(
                    "priceMin",
                    Math.min(Number(event.target.value), Number(draft.priceMax || maxAvailablePrice))
                  )
                }
              />

              <input
                type="range"
                min={minAvailablePrice}
                max={maxAvailablePrice}
                step="10000"
                value={draft.priceMax || maxAvailablePrice}
                onChange={(event) =>
                  updateFilter(
                    "priceMax",
                    Math.max(Number(event.target.value), Number(draft.priceMin || minAvailablePrice))
                  )
                }
              />
            </div>
          </div>

          {FILTER_GROUPS.slice(6).map(renderChipGroup)}

          {/* MILEAGE */}
          <div className="mf-group">
            <h4>Mileage</h4>

            <div className="mf-range-labels">
              <span>{Number(draft.mileageMin || 0).toLocaleString()} km</span>
              <span>{Number(draft.mileageMax || 500000).toLocaleString()} km</span>
            </div>

            <div className="mf-range-inputs">
              <input
                type="range"
                min="0"
                max="500000"
                step="1000"
                value={draft.mileageMin || 0}
                onChange={(event) =>
                  updateFilter(
                    "mileageMin",
                    Math.min(Number(event.target.value), Number(draft.mileageMax || 500000))
                  )
                }
              />

              <input
                type="range"
                min="0"
                max="500000"
                step="1000"
                value={draft.mileageMax || 500000}
                onChange={(event) =>
                  updateFilter(
                    "mileageMax",
                    Math.max(Number(event.target.value), Number(draft.mileageMin || 0))
                  )
                }
              />
            </div>
          </div>

          {/* ENGINE SIZE */}
          <div className="mf-group">
            <h4>Engine Size</h4>

            <div className="mf-range-labels">
              <span>{draft.engineMin || 0} cc</span>
              <span>{draft.engineMax || 8000} cc</span>
            </div>

            <div className="mf-range-inputs">
              <input
                type="range"
                min="0"
                max="8000"
                step="50"
                value={draft.engineMin || 0}
                onChange={(event) =>
                  updateFilter(
                    "engineMin",
                    Math.min(Number(event.target.value), Number(draft.engineMax || 8000))
                  )
                }
              />

              <input
                type="range"
                min="0"
                max="8000"
                step="50"
                value={draft.engineMax || 8000}
                onChange={(event) =>
                  updateFilter(
                    "engineMax",
                    Math.max(Number(event.target.value), Number(draft.engineMin || 0))
                  )
                }
              />
            </div>
          </div>

          {/* NUMBER OF DOORS */}
          <div className="mf-group">
            <h4>Number of Doors</h4>
            <div className="mf-chips">
              {["2", "3", "4", "5", "Other"].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`mf-chip ${
                    (draft.doors || []).includes(value) ? "selected" : ""
                  }`}
                  onClick={() => toggleChip("doors", value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* AD WITH PICTURES */}
          <div className="mf-group">
            <h4>Ad With Pictures</h4>
            <div className="mf-chips">
              <button
                type="button"
                className={`mf-chip ${
                  draft.withPictures ? "selected" : ""
                }`}
                onClick={() =>
                  updateFilter("withPictures", !draft.withPictures)
                }
              >
                With Pictures
              </button>
            </div>
          </div>
        </div>

        <div className="mf-footer">
          <button
            type="button"
            className="mf-clear"
            onClick={() => {
              onClear();
              onClose();
            }}
          >
            Clear All
          </button>

          <button
            type="button"
            className="mf-apply"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default MoreFilters;
