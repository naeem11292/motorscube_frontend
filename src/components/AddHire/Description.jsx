
import { FileText, AlignLeft } from "lucide-react";

function Description({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <FileText size={22} aria-hidden="true" />
        <span>Description</span>
      </h2>

      <div className="form-group">
        <label
          htmlFor="description"
          className="add-sale-field-label"
        >
          <AlignLeft size={16} aria-hidden="true" />
          <span>Description</span>
        </label>

        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the vehicle you want to sell"
          rows="6"
        />
      </div>
    </section>
  );
}

export default Description;
