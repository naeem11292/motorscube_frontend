function ImageUpload({ formData, handleChange }) {
  return (
    <section className="add-sale-section">
      <h2>Vehicle Images</h2>

      {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
        <div className="form-group" key={number}>
          <label htmlFor={`image_${number}`}>
            Image {number}
          </label>

          <input
            id={`image_${number}`}
            name={`image_${number}`}
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
        </div>
      ))}
    </section>
  );
}

export default ImageUpload;