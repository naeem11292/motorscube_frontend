import { useRef, useState, useEffect } from "react";

function ImageUpload({ images, setImages }) {
  const MAX_IMAGES = 30;
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState("");

  const previews = images.map((file) => ({
    file,
    url: URL.createObjectURL(file),
  }));

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [images]);

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setMessage("You can upload a maximum of 30 images.");
      event.target.value = "";
      return;
    }

    const imageFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    const filesToAdd = imageFiles.slice(0, remainingSlots);

    setImages((previousImages) => [...previousImages, ...filesToAdd]);

    if (imageFiles.length !== selectedFiles.length) {
      setMessage("Only image files are allowed.");
    } else if (imageFiles.length > remainingSlots) {
      setMessage(`Only ${remainingSlots} more image(s) can be added.`);
    } else {
      setMessage("");
    }

    event.target.value = "";
  };

  const removeImage = (indexToRemove) => {
    setImages((previousImages) =>
      previousImages.filter((_, index) => index !== indexToRemove)
    );
    setMessage("");
  };

  return (
    <section className="hire-form-section">
      <h2>Upload Images</h2>

      <p className="hire-image-help">
        Add clear pictures of your vehicle or equipment. You can select up to
        30 images.
      </p>

      <div className="hire-image-toolbar">
        <button
          type="button"
          className="hire-image-add-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={images.length >= MAX_IMAGES}
        >
          + Add Images
        </button>

        <span>
          {images.length} / {MAX_IMAGES} images
        </span>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleImageChange}
      />

      {message && <p className="hire-image-message">{message}</p>}

      <div className="hire-image-grid">
        {previews.map((preview, index) => (
          <div className="hire-image-card" key={`${preview.file.name}-${index}`}>
            <img src={preview.url} alt={`Hire listing ${index + 1}`} />

            <button
              type="button"
              className="hire-image-remove"
              onClick={() => removeImage(index)}
              aria-label={`Remove image ${index + 1}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImageUpload;