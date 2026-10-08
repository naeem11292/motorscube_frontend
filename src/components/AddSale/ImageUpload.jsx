import { useState, useRef } from "react";

function ImageUpload({ images, setImages }) {
  const MAX_IMAGES = 30;
  const COLUMNS = 5;

  const [selectedImage, setSelectedImage] = useState(null);
  const [message, setMessage] = useState("");

  const fileInput = useRef(null);

  const rowCount = Math.ceil(images.length / COLUMNS);

  const handleImageSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);

    if (selectedFiles.length === 0) {
      event.target.value = "";
      return;
    }

    const remainingSlots = MAX_IMAGES - images.length;

    if (selectedFiles.length > remainingSlots) {
      if (remainingSlots === 0) {
        setMessage(
          "Maximum 30 images are allowed."
        );
      } else {
        setMessage(
          `Only ${remainingSlots} more image${
            remainingSlots > 1 ? "s" : ""
          } can be added. Maximum 30 images are allowed.`
        );
      }

      event.target.value = "";
      return;
    }

    setImages((previous) => [
      ...previous,
      ...selectedFiles,
    ]);

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
      previous.filter(
        (_, index) => index !== imageIndex
      )
    );

    setSelectedImage(null);
    setMessage("");
  };

  return (
    <section className="add-sale-section">
      <h2>Vehicle Images</h2>

     

      {message && (
        <div
          className="alert alert-warning"
          role="alert"
        >
          {message}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        multiple
        style={{ display: "none" }}
        onChange={handleImageSelect}
      />

      {/* Dynamic image rows */}
      {rowCount > 0 && (
        <div className="vehicle-image-rows">
          {Array.from({ length: rowCount }).map(
            (_, rowIndex) => {
              const rowStart = rowIndex * COLUMNS;
              const rowImages = images.slice(
                rowStart,
                rowStart + COLUMNS
              );

              return (
                <div
                  className="vehicle-image-row"
                  key={rowIndex}
                >
                  <div className="vehicle-images-grid">
                    {rowImages.map(
                      (file, columnIndex) => {
                        const imageIndex =
                          rowStart + columnIndex;

                        return (
                          <div
                            className="vehicle-image-slot"
                            key={`${file.name}-${imageIndex}`}
                          >
                            <button
                              type="button"
                              className="vehicle-image-button"
                              onClick={() =>
                                setSelectedImage({
                                  file,
                                  index:
                                    imageIndex,
                                })
                              }
                            >
                              <img
                                src={URL.createObjectURL(
                                  file
                                )}
                                alt="Vehicle"
                              />

                              {/* Delete X */}
                              <span
                                className="image-delete-button"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  removeImage(
                                    imageIndex
                                  );
                                }}
                              >
                                ×
                              </span>
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* Add Images button */}
      {images.length < MAX_IMAGES && (
        <button
          type="button"
          className="btn btn-primary row-add-button"
          onClick={openFilePicker}
        >
          + Add Images({images.length}/30)
        </button>
      )}

      {images.length === MAX_IMAGES && (
        <p className="text-muted mt-3">
          Maximum 30 images selected.
        </p>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="image-preview-overlay"
          onClick={() =>
            setSelectedImage(null)
          }
        >
          <div
            className="image-preview-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="preview-close"
              onClick={() =>
                setSelectedImage(null)
              }
            >
              ×
            </button>

            <div className="preview-image-container">
              <img
                src={URL.createObjectURL(
                  selectedImage.file
                )}
                alt="Vehicle preview"
              />
            </div>

            <div className="preview-actions">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() =>
                  removeImage(
                    selectedImage.index
                  )
                }
              >
                Delete Image
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
                  + Add Image
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          

          .vehicle-image-rows {
            width: 100%;
          }

          .vehicle-image-row {
            margin-bottom: 20px;
          }

          .vehicle-images-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            column-gap:20px;
            row-gap: 20px;
          }

          .vehicle-image-slot {
            min-width: 0;
            width:100%;
          }

          .vehicle-image-button {
            position: relative;
            display: block;
            width: 200%;
            height: 150px;
            padding: 0;
            border: 1px solid #ddd;
            border-radius: 20px;
            background: white;
            cursor: pointer;
            overflow: hidden;
          }

          .vehicle-image-button:hover {
            border-color: #0d6efd;
          }

          .vehicle-image-button img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .image-delete-button {
            position: absolute;
            top: 0px;
            left: 6px;
            z-index: 2;

            display: flex;
            align-items: center;
            justify-content: center;

            width: 28px;
            height: 25px;

            border-radius: 50%;
            background: rgba(0, 0, 0, 0.75);
            color: white;

            font-size: 22px;
            font-weight: bold;
            line-height: 1;

            cursor: pointer;
          }

          .image-delete-button:hover {
            background: #dc3545;
          }

          .row-add-button {
  width: 160px !important;
  height: 40px !important;
  margin-top: 1px;
  margin-left: auto;
  display: block;

  padding: 0 !important;
  border: none !important;
  border-radius: 6px !important;
  background: #0d6efd !important;
  color: white !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  cursor: pointer;
  box-sizing: border-box;
}

.row-add-button:hover {
  background: #0b5ed7 !important;
}
          /* Preview Modal */

          .image-preview-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;

            display: flex;
            align-items: center;
            justify-content: center;

            padding: 20px;
            background: rgba(0, 0, 0, 0.75);
          }

          .image-preview-modal {
            position: relative;

            width: min(800px, 100%);
            max-height: 90vh;

            padding: 20px;
            border-radius: 10px;

            background: white;
          }

          .preview-close {
            position: absolute;
            top: 8px;
            right: 12px;
            z-index: 2;

            width: 35px;
            height: 35px;

            border: none;
            border-radius: 50%;

            background: #222;
            color: white;

            font-size: 24px;
            line-height: 30px;

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

            gap: 12px;
            margin-top: 15px;
          }

          @media (max-width: 768px) {
            .vehicle-images-grid {
              grid-template-columns: repeat(5, 1fr);
              gap: 6px;
            }

            .vehicle-image-button {
              height: 100px;
            }

            .image-delete-button {
              top: 3px;
              right: 3px;

              width: 23px;
              height: 23px;

              font-size: 18px;
            }
          }

          @media (max-width: 576px) {
            .vehicle-images-grid {
              grid-template-columns: repeat(5, 1fr);
              gap: 4px;
            }

            .vehicle-image-button {
              height: 75px;
            }

            .image-delete-button {
              top: 2px;
              right: 2px;

              width: 19px;
              height: 19px;

              font-size: 15px;
            }

            .preview-image-container {
              height: 55vh;
            }
          }
        `}
      </style>
    </section>
  );
}

export default ImageUpload;