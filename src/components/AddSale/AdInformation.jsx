function AdInformation({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Ad Information</h2>

      <div className="form-group">
        <label htmlFor="user_type">User Type</label>
        <select
          id="user_type"
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
        >
          <option value="">Select user type</option>
          <option value="individual">Individual</option>
          <option value="dealer">Dealer</option>
          <option value="business">Business</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="ad_type">Ad Type</label>
        <select
          id="ad_type"
          name="ad_type"
          value={formData.ad_type}
          onChange={handleChange}
        >
          <option value="">Select ad type</option>
          <option value="sale">Sale</option>
          <option value="featured">Featured</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="post_status">Post Status</label>
        <select
          id="post_status"
          name="post_status"
          value={formData.post_status}
          onChange={handleChange}
        >
          <option value="">Select post status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
        </select>
      </div>
    </section>
  );
}

export default AdInformation;