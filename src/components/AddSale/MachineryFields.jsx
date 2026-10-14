
import {
  Cog,
  Layers,
  ClipboardCheck,
  Factory,
  CarFront,
  CalendarDays,
  Weight,
  Ruler,
  Clock3,
} from "lucide-react";

function MachineryFields({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <Cog size={22} aria-hidden="true" />
        <span>Machinery Details</span>
      </h2>

      <div className="form-group">
        <label
          htmlFor="machinery_type"
          className="add-sale-field-label"
        >
          <Factory size={16} aria-hidden="true" />
          <span>Machinery Type</span>
        </label>
        <input
          id="machinery_type"
          name="type"
          type="text"
          value={formData.type}
          onChange={handleChange}
          placeholder="e.g. Excavator, Loader"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_subtype"
          className="add-sale-field-label"
        >
          <Layers size={16} aria-hidden="true" />
          <span>Machinery Subtype</span>
        </label>
        <input
          id="machinery_subtype"
          name="subtype"
          type="text"
          value={formData.subtype}
          onChange={handleChange}
          placeholder="Enter subtype"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_condition"
          className="add-sale-field-label"
        >
          <ClipboardCheck size={16} aria-hidden="true" />
          <span>Condition</span>
        </label>
        <select
          id="machinery_condition"
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
          htmlFor="machinery_make"
          className="add-sale-field-label"
        >
          <Factory size={16} aria-hidden="true" />
          <span>Make</span>
        </label>
        <input
          id="machinery_make"
          name="make"
          type="text"
          value={formData.make}
          onChange={handleChange}
          placeholder="Enter make"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_model"
          className="add-sale-field-label"
        >
          <CarFront size={16} aria-hidden="true" />
          <span>Model</span>
        </label>
        <input
          id="machinery_model"
          name="model"
          type="text"
          value={formData.model}
          onChange={handleChange}
          placeholder="Enter model"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_year"
          className="add-sale-field-label"
        >
          <CalendarDays size={16} aria-hidden="true" />
          <span>Year</span>
        </label>
        <input
          id="machinery_year"
          name="year"
          type="number"
          min="0"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter year"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_weight"
          className="add-sale-field-label"
        >
          <Weight size={16} aria-hidden="true" />
          <span>Weight</span>
        </label>
        <input
          id="machinery_weight"
          name="weight"
          type="text"
          value={formData.weight}
          onChange={handleChange}
          placeholder="Enter weight"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_dimensions"
          className="add-sale-field-label"
        >
          <Ruler size={16} aria-hidden="true" />
          <span>Dimensions</span>
        </label>
        <input
          id="machinery_dimensions"
          name="dimensions"
          type="text"
          value={formData.dimensions}
          onChange={handleChange}
          placeholder="Enter dimensions"
        />
      </div>

      <div className="form-group">
        <label
          htmlFor="machinery_hours_used"
          className="add-sale-field-label"
        >
          <Clock3 size={16} aria-hidden="true" />
          <span>Hours Used</span>
        </label>
        <input
          id="machinery_hours_used"
          name="hours_used"
          type="number"
          min="0"
          step="0.01"
          value={formData.hours_used}
          onChange={handleChange}
          placeholder="e.g. 1250"
        />
      </div>
    </section>
  );
}

export default MachineryFields;
