
import { useEffect, useRef, useState } from "react";
import "./SearchableSelect.css";

function SearchableSelect({
  id,
  label,
  icon: Icon,
  value,
  options = [],
  getOptionValue,
  getOptionLabel,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const selectedOption = options.find(
    (option) => String(getOptionValue(option)) === String(value)
  );

  const selectedLabel = selectedOption
    ? getOptionLabel(selectedOption)
    : "";

  const filteredOptions = options.filter((option) =>
    String(getOptionLabel(option))
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  const openDropdown = () => {
    if (disabled) return;
    setSearch("");
    setIsOpen(true);
  };

  const selectOption = (option) => {
    onChange(String(getOptionValue(option)));
    setIsOpen(false);
    setSearch("");
  };

  return (
    <div className="form-group searchable-select" ref={containerRef}>
      <label
        id={`${id}-label`}
        htmlFor={id}
        className="add-sale-field-label"
      >
        {Icon && <Icon size={16} aria-hidden="true" />}
        <span>{label}</span>
      </label>

      <button
        type="button"
        id={id}
        className="searchable-select-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${id}-label`}
        disabled={disabled}
        onClick={() => (isOpen ? setIsOpen(false) : openDropdown())}
      >
        <span className={selectedLabel ? "" : "searchable-placeholder"}>
          {selectedLabel || placeholder}
        </span>

        <span className="searchable-select-icon" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="searchable-select-panel">
          <div className="searchable-select-search">
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}...`}
              aria-label={`Search ${label}`}
              autoComplete="off"
            />
          </div>

          <div
            className="searchable-select-options"
            role="listbox"
            aria-label={label}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const optionValue = String(getOptionValue(option));
                const optionLabel = getOptionLabel(option);
                const isSelected = optionValue === String(value);

                return (
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`searchable-select-option ${
                      isSelected ? "selected" : ""
                    }`}
                    key={optionValue}
                    onClick={() => selectOption(option)}
                  >
                    {optionLabel}
                    {isSelected && (
                      <span aria-hidden="true"> ✓</span>
                    )}
                  </button>
                );
              })
            ) : (
              <p className="searchable-select-empty">
                No matching {label.toLowerCase()} found.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
