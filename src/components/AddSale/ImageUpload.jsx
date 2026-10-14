
import { useState, useRef, useEffect } from "react";
import {
  Images,
  ImagePlus,
  Trash2,
  X,
  Eye,
} from "lucide-react";

function ImageUpload({ images, setImages }) {
  const MAX_IMAGES = 30;
  const COLUMNS = 5;

  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");
  const [imageUrls, setImageUrls] = useState([]);

  const fileInput = useRef(null);

  // Create and clean up image preview URLs.
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));

    setImageUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // Five images per desktop row.
  const rowCount = Math.ceil(images.length / COLUMNS);

  const handleImageSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setMessage("Maximum 30 images are allowed.");
      event.target.value = "";
      return;
    }

    if (selectedFiles.length > remainingSlots) {
      setMessage(
        `You can add only ${remainingSlots} more image${
          remainingSlots === 1 ? "" : "s"
        }. Maximum 30 images are allowed.`
      );
      event.target.value = "";
      return;
    }

    setImages((previous) => [...previous, ...selectedFiles]);
    setMessage("");
    event.target.value = "";
  };

  const openFilePicker = () => {
    if (images.length >= MAX_IMAGES) {
      setMessage("Maximum 30 images are allowed.");
      return;
    }

    fileInput.current?.click();
  };

  const removeImage = (imageIndex) => {
    setImages((previous) =>
      previous.filter((_, index) => index !== imageIndex)
    );

    setSelectedImage(null);
    setMessage("");
  };

  return (
    <section className="add-sale-section image-upload-section">
      <h2 className="add-sale-section-heading">
        <Images size={22} aria-hidden="true" />
        <span>Vehicle Images</span>
      </h2>

      <div className="image-upload-toolbar">
        <p className="image-upload-counter">
          <Images size={16} aria-hidden="true" />
          <span>{images.length} of {MAX_IMAGES} images selected</span>
        </p>
      </div>

      {message && (
        <div className="alert alert-warning" role="alert">
          {message}
        </div>
      )}

      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />

      {rowCount > 0 && (
        <div className="vehicle-image-rows">
          {Array.from({ length: rowCount }).map((_, rowIndex) => {
            const rowStart = rowIndex * COLUMNS;
            const rowImages = images.slice(
              rowStart,
              rowStart + COLUMNS
            );

            return (
              <div className="vehicle-image-row" key={rowIndex}>
                <div className="vehicle-images-grid">
                  {rowImages.map((file, columnIndex) => {
                    const imageIndex = rowStart + columnIndex;

                    return (
                      <div
                        className="vehicle-image-slot"
                        key={`${file.name}-${file.lastModified}-${imageIndex}`}
                      >
                        <button
                          type="button"
                          className="vehicle-image-button"
                          onClick={() =>
                            setSelectedImage({
                              file,
                              index: imageIndex,
                            })
                          }
                          aria-label={`Preview vehicle image ${
                            imageIndex + 1
                          }`}
                        >
                          <img
                            src={imageUrls[imageIndex]}
                            alt={`Vehicle ${imageIndex + 1}`}
                          />

                          <span className="image-preview-indicator">
                            <Eye size={16} aria-hidden="true" />
                          </span>
                        </button>

                        <button
                          type="button"
                          className="image-delete-button"
                          aria-label={`Delete image ${imageIndex + 1}`}
                          onClick={() => removeImage(imageIndex)}
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {images.length < MAX_IMAGES && (
        <button
          type="button"
          className="btn btn-primary row-add-button"
          onClick={openFilePicker}
        >
          <ImagePlus size={17} aria-hidden="true" />
          <span>Add Images ({images.length}/30)</span>
        </button>
      )}

      {images.length === MAX_IMAGES && (
        <p className="text-muted mt-3 image-limit-message">
          <Images size={16} aria-hidden="true" />
          <span>Maximum 30 images selected.</span>
        </p>
      )}

      {selectedImage && (
        <div
          className="image-preview-overlay"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="image-preview-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Vehicle image preview"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="preview-close"
              onClick={() => setSelectedImage(null)}
              aria-label="Close preview"
            >
              <X size={22} aria-hidden="true" />
            </button>

            <div className="preview-image-container">
              <img
                src={imageUrls[selectedImage.index]}
                alt={`Vehicle preview ${selectedImage.index + 1}`}
              />
            </div>

            <div className="preview-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeImage(selectedImage.index)}
              >
                <Trash2 size={16} aria-hidden="true" />
                <span>Delete Image</span>
              </button>

              {images.length < MAX_IMAGES && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    setSelectedImage(null);
                    openFilePicker();
                  }}
                >
                  <ImagePlus size={16} aria-hidden="true" />
                  <span>Add Image</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .image-upload-section {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
        }

        .image-upload-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .image-upload-counter,
        .image-limit-message {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .image-upload-counter svg,
        .image-limit-message svg {
          flex-shrink: 0;
          color: #2563eb;
        }

        .vehicle-image-rows {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
        }

        .vehicle-image-row {
          width: 100%;
          margin-bottom: 20px;
        }

        .vehicle-images-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 20px;
          width: 100%;
          box-sizing: border-box;
        }

        .vehicle-image-slot {
          position: relative;
          min-width: 0;
          width: 100%;
          box-sizing: border-box;
        }

        .vehicle-image-button {
          position: relative;
          display: block;
          width: 100%;
          height: 180px;
          padding: 0;
          border: 1px solid #ddd;
          border-radius: 12px;
          background: #f8f9fa;
          cursor: pointer;
          overflow: hidden;
          box-sizing: border-box;
        }

        .vehicle-image-button:hover {
          border-color: #2563eb;
        }

        .vehicle-image-button img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-preview-indicator {
          position: absolute;
          right: 8px;
          bottom: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          opacity: 0;
          transition: opacity 0.2s ease;
        }

        .vehicle-image-button:hover .image-preview-indicator,
        .vehicle-image-button:focus-visible .image-preview-indicator {
          opacity: 1;
        }

        .image-delete-button {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.78);
          color: white;
          cursor: pointer;
          box-sizing: border-box;
        }

        .image-delete-button:hover {
          background: #dc3545;
        }

        .row-add-button {
          display: flex !important;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 190px !important;
          min-height: 42px;
          margin: 8px 0 0 auto;
          padding: 0 12px !important;
          border: none !important;
          border-radius: 6px !important;
          background: #2563eb !important;
          color: white !important;
          font-size: 14px !important;
          font-weight: 500 !important;
          cursor: pointer;
          box-sizing: border-box;
        }

        .row-add-button:hover {
          background: #1d4ed8 !important;
        }

        .image-limit-message {
          margin-top: 16px;
        }

        .preview-actions .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .image-preview-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.75);
          box-sizing: border-box;
        }

        .image-preview-modal {
          position: relative;
          width: min(800px, 100%);
          max-height: 90vh;
          padding: 20px;
          border-radius: 10px;
          background: white;
          overflow-y: auto;
          box-sizing: border-box;
        }

        .preview-close {
          position: absolute;
          top: 8px;
          right: 12px;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 35px;
          height: 35px;
          padding: 0;
          border: none;
          border-radius: 50%;
          background: #222;
          color: white;
          cursor: pointer;
        }

        .preview-image-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 65vh;
          margin-top: 10px;
        }

        .preview-image-container img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 6px;
        }

        .preview-actions {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 15px;
        }

        @media (max-width: 992px) {
          .vehicle-images-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 16px;
          }

          .vehicle-image-button {
            height: 160px;
          }
        }

        @media (max-width: 576px) {
          .vehicle-images-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            column-gap: 16px;
            row-gap: 16px;
          }

          .vehicle-image-button {
            height: auto;
            aspect-ratio: 4 / 3;
            border-radius: 12px;
          }

          .image-delete-button {
            top: 8px;
            right: 8px;
            width: 30px;
            height: 30px;
          }

          .image-preview-indicator {
            display: none;
          }

          .row-add-button {
            width: 180px !important;
          }

          .image-preview-overlay {
            padding: 12px;
          }

          .image-preview-modal {
            padding: 14px;
          }

          .preview-image-container {
            height: 55vh;
          }
        }
      `}</style>
    </section>
  );
}

export default ImageUpload;