
function ImageUpload({ images, setImages }) {
  const handleImageSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);

    const remainingSlots = 8 - images.length;

    if (remainingSlots <= 0) {
      event.target.value = "";
      return;
    }

    // Only add enough files to stay within the 8-image limit
    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    setImages((previous) => [
      ...previous,
      ...filesToAdd,
    ]);

    // Allows the user to select the same file again later
    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages((previous) =>
      previous.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <section className="add-sale-section">
      <h2>Vehicle Images</h2>

      <p>
        {images.length} / 8 images selected
      </p>

      {images.length < 8 && (
        <div className="form-group">
          <label htmlFor="vehicle-images">
            Select Images
          </label>

          <input
            id="vehicle-images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
          />
        </div>
      )}

      {images.length === 8 && (
        <p>
          Maximum 8 images selected. Remove an image to select another.
        </p>
      )}

      {images.length > 0 && (
        <div className="image-preview-grid">
          {images.map((file, index) => (
            <div
              className="image-preview"
              key={`${file.name}-${index}`}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Vehicle ${index + 1}`}
              />

              <button
                type="button"
                onClick={() => removeImage(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default ImageUpload;
