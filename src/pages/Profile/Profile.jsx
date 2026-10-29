
import { useEffect, useMemo, useRef, useState } from "react";
import "./Profile.css";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function getTokenPayload() {
  try {
    const token = localStorage.getItem("motorscube_token");
    if (!token) return null;

    const payload = token.split(".")[1];
    return JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );
  } catch {
    return null;
  }
}

export default function Profile() {
  const user = useMemo(() => getTokenPayload(), []);
  const fileInputRef = useRef(null);

  const [savedPhoto, setSavedPhoto] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const profileFields = [
    ["User ID", user?.sub ?? user?.id ?? user?.user_id ?? "Not available"],
    ["Name", user?.user_name ?? user?.name ?? "Not available"],
    ["Email", user?.user_email ?? user?.email ?? "Not available"],
    ["Account Type", user?.user_type ?? "Not available"],
    ["Role", user?.role_id ?? "Not available"],
  ];

  const icons = {
    "User ID": "🪪",
    Name: "👤",
    Email: "✉️",
    "Account Type": "🏢",
    Role: "🛡️",
  };

  useEffect(() => {
    return () => {
      if (previewPhoto.startsWith("blob:")) {
        URL.revokeObjectURL(previewPhoto);
      }
    };
  }, [previewPhoto]);

  function handlePhotoSelect(event) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    setError("");
    setMessage("");

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image size must not exceed 5 MB.");
      return;
    }

    const newPreview = URL.createObjectURL(file);

    setPreviewPhoto((oldPreview) => {
      if (oldPreview.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }
      return newPreview;
    });

    setSelectedFile(file);
  }

  function handleSavePhoto() {
    if (!selectedFile) {
      setError("Please select a photo first.");
      return;
    }

    setError("");
    setMessage(
      "Preview ready. Permanent saving requires the backend profile-picture API."
    );
  }

  function handleChangePhoto() {
    fileInputRef.current?.click();
  }

  function handleDeletePhoto() {
    if (!previewPhoto && !savedPhoto) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete your profile picture?"
    );

    if (!confirmed) return;

    setPreviewPhoto((oldPreview) => {
      if (oldPreview.startsWith("blob:")) {
        URL.revokeObjectURL(oldPreview);
      }
      return "";
    });

    setSavedPhoto("");
    setSelectedFile(null);
    setError("");
    setMessage(
      "Photo removed from this preview. Permanent deletion requires the backend API."
    );
  }

  const currentPhoto = previewPhoto || savedPhoto;

  return (
    <main className="profile-page">
      <header className="profile-header">
        <div className="profile-avatar profile-avatar-wrapper">
          {currentPhoto ? (
            <img
              src={currentPhoto}
              alt="Profile"
              className="profile-avatar-image"
            />
          ) : (
            <span aria-hidden="true">👤</span>
          )}
        </div>

        <div className="profile-header-content">
          <p className="profile-eyebrow">MOTORSCUBE ACCOUNT</p>
          <h1>My Profile</h1>
          <p>Manage your profile picture and account information.</p>
        </div>
      </header>

      <section className="profile-card profile-photo-card">
        <div className="profile-card-heading">
          <div className="profile-section-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>

          <div>
            <h2>Profile Picture</h2>
            <p>Upload or update your account photo</p>
          </div>
        </div>

        <div className="profile-photo-content">
          <div className="profile-photo-preview">
            {currentPhoto ? (
              <img
                src={currentPhoto}
                alt="Selected profile"
                className="profile-photo-image"
              />
            ) : (
              <span aria-hidden="true">👤</span>
            )}
          </div>

          <div className="profile-photo-details">
            <h3>Your profile photo</h3>
            <p>
              JPG, PNG, or WebP. Maximum file size: 5 MB.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              hidden
            />

            <div className="profile-photo-actions">
              <button
                type="button"
                className="profile-photo-button profile-photo-primary"
                onClick={handleChangePhoto}
              >
                {currentPhoto ? "Change Photo" : "Upload Photo"}
              </button>

              <button
                type="button"
                className="profile-photo-button profile-photo-save"
                onClick={handleSavePhoto}
                disabled={!selectedFile}
              >
                Save Photo
              </button>

              {currentPhoto && (
                <button
                  type="button"
                  className="profile-photo-button profile-photo-delete"
                  onClick={handleDeletePhoto}
                >
                  Delete Photo
                </button>
              )}
            </div>

            {error && (
              <p className="profile-message profile-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="profile-message profile-success" role="status">
                {message}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="profile-card">
        <div className="profile-card-heading">
          <div className="profile-section-icon" aria-hidden="true">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
            </svg>
          </div>

          <div>
            <h2>Personal Information</h2>
            <p>Your account details and identification</p>
          </div>
        </div>

        <div className="profile-information-grid">
          {profileFields.map(([label, value]) => {
            const isUnavailable = value === "Not available";

            return (
              <div className="profile-information-item" key={label}>
                <div className="profile-information-icon" aria-hidden="true">
                  {icons[label]}
                </div>

                <div className="profile-information-content">
                  <span className="profile-information-label">{label}</span>
                  <span
                    className={`profile-information-value ${
                      isUnavailable ? "is-unavailable" : ""
                    }`}
                  >
                    {String(value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="profile-information-footer">
          <span className="profile-footer-dot" />
          <p>Your account information is displayed securely.</p>
        </div>
      </section>
    </main>
  );
}
