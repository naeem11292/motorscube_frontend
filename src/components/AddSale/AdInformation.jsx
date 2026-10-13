function AdInformation({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Ad Information</h2>

  

   

      <div className="form-group">
        <label htmlFor="post_status">Post Status</label>
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