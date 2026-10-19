import { useEffect, useRef, useState } from "react";
import { Images, ImagePlus, Trash2, Eye, X } from "lucide-react";

function DealershipImageUpload({ images, setImages }) {
  const MAX_IMAGES = 8;
  const fileInput = useRef(null);

  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImageUrls(urls);

    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleImageSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (!selectedFiles.length) return;

    if (images.length + selectedFiles.length > MAX_IMAGES) {
      setMessage(`You can select a maximum of ${MAX_IMAGES} images.`);
      event.target.value = "";
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type)
    );

    if (invalidFile) {
      setMessage("Only JPG, PNG, and WEBP images are allowed.");
      event.target.value = "";
      return;
    }

    const oversizedFile = selectedFiles.find(
      (file) => file.size > 5 * 1024 * 1024
    );

    if (oversizedFile) {
      setMessage("Each image must be 5 MB or smaller.");
      event.target.value = "";
      return;
    }

    setImages((previous) => [...previous, ...selectedFiles]);
    setMessage("");
    event.target.value = "";
  };

  const removeImage = (index) => {
    setImages((previous) => previous.filter((_, i) => i !== index));
    setSelectedImage(null);
    setMessage("");
  };

  return (
    <section className="add-sale-section image-upload-section">
      <h2 className="add-sale-section-heading">
        <Images size={22} />
        <span>Dealership Images</span>
      </h2>

      <p>
        {images.length} of {MAX_IMAGES} images selected
      </p>

      {message && <p role="alert">{message}</p>}

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={handleImageSelect}
      />

      <div className="dealership-images-grid">
        {images.map((file, index) => (
          <div className="dealership-image-item" key={`${file.name}-${file.lastModified}-${index}`}>
            <button
              type="button"
              className="dealership-image-preview"
              onClick={() => setSelectedImage(index)}
              aria-label={`Preview image ${index + 1}`}
            >
              <img src={imageUrls[index]} alt={`Dealership ${index + 1}`} />
              <Eye size={18} />
            </button>

            <button
              type="button"
              className="dealership-image-delete"
              onClick={() => removeImage(index)}
              aria-label={`Remove image ${index + 1}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {images.length < MAX_IMAGES && (
        <button
          type="button"
          className="dealership-add-images"
          onClick={() => fileInput.current?.click()}
        >
          <ImagePlus size={18} />
          Add Images ({images.length}/{MAX_IMAGES})
        </button>
      )}

      {selectedImage !== null && imageUrls[selectedImage] && (
        <div
          className="dealership-preview-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="dealership-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Dealership image preview"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close preview"
            >
              <X size={22} />
            </button>

            <img
              src={imageUrls[selectedImage]}
              alt={`Dealership preview ${selectedImage + 1}`}
            />

            <button
              type="button"
              onClick={() => removeImage(selectedImage)}
            >
              <Trash2 size={16} /> Delete Image
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DealershipImageUpload;