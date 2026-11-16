
import { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    accountType: "",
    countryCode: "+92",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
    user_picture: null,
  });

  const [picturePreview, setPicturePreview] = useState("");

  // Clean up preview URL when component unmounts or image changes
  useEffect(() => {
    if (!formData.user_picture) {
      setPicturePreview("");
      return;
    }

    const previewURL = URL.createObjectURL(formData.user_picture);
    setPicturePreview(previewURL);

    return () => URL.revokeObjectURL(previewURL);
  }, [formData.user_picture]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handlePictureChange(event) {
    const file = event.target.files?.[0] || null;

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, and WebP images are allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Profile picture must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    setFormData((prev) => ({
      ...prev,
      user_picture: file,
    }));
  }

  function removePicture() {
    setFormData((prev) => ({
      ...prev,
      user_picture: null,
    }));

    const fileInput = document.getElementById("user_picture");

    if (fileInput) {
      fileInput.value = "";
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (
      formData.password.length < 8 ||
      formData.password.length > 10 ||
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password)
    ) {
      alert(
        "Password must be 8-10 characters and contain an uppercase letter, a lowercase letter, and a number."
      );
      return;
    }

    const registrationData = new FormData();

    registrationData.append("user_type", formData.accountType);
    registrationData.append("user_name", formData.fullName);
    registrationData.append("user_email", formData.email);
    registrationData.append(
      "user_country_code",
      formData.countryCode
    );
    registrationData.append("user_mobile", formData.mobile);
    registrationData.append("user_password", formData.password);

    if (formData.user_picture) {
      registrationData.append(
        "user_picture",
        formData.user_picture
      );
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/register",
        registrationData
      );

      if (response.data.success) {
        navigate("/verify-registration", {
          state: { email: formData.email },
        });
      }
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="signup-page">
      {/* Left Side */}
      <section className="signup-left">
        <div className="signup-logo">
          Motors<span>Cube</span>
        </div>

        <div className="signup-intro">
          <div className="signup-eyebrow">
            CREATE ACCOUNT
          </div>

          <h1>Join MotorsCube</h1>

          <p>
            Create one account for buying, selling, hiring,
            vehicle management, and automotive services.
          </p>
        </div>
      </section>

      {/* Right Side */}
      <section className="signup-right">
        <div className="signup-card">
          <h2>Create Account</h2>

          <p className="signup-subtitle">
            Enter all details below. OTP verification will be on the next screen.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Profile Picture */}
            <div className="profile-picture-section">
              <label htmlFor="user_picture">
                Profile Picture
              </label>

              <div className="profile-picture-upload">
                {picturePreview ? (
                  <img
                    src={picturePreview}
                    alt="Profile preview"
                    className="profile-picture-preview"
                  />
                ) : (
                  <div className="profile-picture-placeholder">
                    <span>+</span>
                    <small>Add Photo</small>
                  </div>
                )}

                <div className="profile-picture-actions">
                  <label
                    htmlFor="user_picture"
                    className="profile-picture-button"
                  >
                    {picturePreview ? "Change Photo" : "Upload Photo"}
                  </label>

                  {picturePreview && (
                    <button
                      type="button"
                      className="remove-picture-button"
                      onClick={removePicture}
                    >
                      Remove
                    </button>
                  )}

                  <small>
                    JPEG, PNG or WebP. Maximum size 5 MB.
                  </small>
                </div>
              </div>

              <input
                id="user_picture"
                name="user_picture"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePictureChange}
                hidden
              />
            </div>

            {/* Row 1 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={120}
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountType">Account Type</label>

                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Private or Trader / Business
                  </option>

                  <option value="private">Private</option>
                  <option value="trader">Trader / Business</option>
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="countryCode">Country Code</label>

                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                >
                  <option value="+92">Pakistan +92</option>
                  <option value="+1">USA +1</option>
                  <option value="+44">UK +44</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="mobile">Mobile Number</label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                  required
                  minLength={7}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group full-width">
              <label htmlFor="email">Email Address</label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="password-wrapper">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    maxLength={10}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm Password
                </label>

                <div className="password-wrapper">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={8}
                    maxLength={10}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="password-toggle"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            </div>

            {/* Password requirements */}
            <p className="password-hint">
              Password must be 8-10 characters and contain
              an uppercase letter, a lowercase letter, and a number.
            </p>

            {/* Submit */}
            <button
              type="submit"
              className="create-account-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account & Send OTP"}
            </button>
          </form>

          {/* Sign In */}
          <p className="signin-link">
            Already have an account?{" "}
            <Link to="/">Sign In</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default SignUp;
