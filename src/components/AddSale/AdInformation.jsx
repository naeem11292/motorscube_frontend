
import {
  ClipboardList,
  BadgeCheck,
} from "lucide-react";

function AdInformation({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2 className="add-sale-section-heading">
        <ClipboardList size={22} aria-hidden="true" />
        <span>Ad Information</span>
      </h2>

      <div className="form-group">
        <label
          htmlFor="post_status"
          className="add-sale-field-label"
        >
          <BadgeCheck size={16} aria-hidden="true" />
          <span>Post Status</span>
        </label>

        <select
          id="post_status"
          name="post_status"
          value={formData.post_status}
          onChange={handleChange}
        >
          <option value="">Pending</option>
        </select>
      </div>
    </section>
  );
}

export default AdInformation;
