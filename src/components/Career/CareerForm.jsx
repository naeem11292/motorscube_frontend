
import { useState } from "react";
import { createCareerApplication } from "../../api/career.api";
import "./CareerForm.css";

function CareerForm() {
  const [formData, setFormData] = useState({
    candidate_name: "",
    candidate_city: "",
    candidate_cell: "",
    candidate_email: "",
    candidate_gender: "",
    candidate_msg: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleCvChange = (event) => {
    const file = event.target.files?.[0];

    setErrorMessage("");
    setSuccessMessage("");

    if (!file) {
      setCvFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a PDF, DOC, or DOCX CV.");
      event.target.value = "";
      setCvFile(null);
      return;
    }

    setCvFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.candidate_name.trim() ||
      !formData.candidate_city.trim() ||
      !formData.candidate_cell.trim() ||
      !formData.candidate_email.trim() ||
      !formData.candidate_gender
    ) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    if (formData.candidate_name.trim().length < 2) {
      setErrorMessage("Your name must contain at least 2 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidate_email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (formData.candidate_cell.trim().length < 7) {
      setErrorMessage("Please enter a valid phone number.");
      return;
    }

    setLoading(true);

    try {
      // The current backend endpoint accepts JSON, not multipart uploads.
      // CV upload must be connected after backend upload middleware is added.
      const payload = {
        ...formData,
        candidate_name: formData.candidate_name.trim(),
        candidate_city: formData.candidate_city.trim(),
        candidate_cell: formData.candidate_cell.trim(),
        candidate_email: formData.candidate_email.trim().toLowerCase(),
        candidate_msg: formData.candidate_msg.trim(),
      };

      await createCareerApplication(payload);

      setSuccessMessage(
        "Your application has been submitted successfully!"
      );

      setFormData({
        candidate_name: "",
        candidate_city: "",
        candidate_cell: "",
        candidate_email: "",
        candidate_gender: "",
        candidate_msg: "",
      });

      setCvFile(null);

      const fileInput = document.getElementById("candidate_cv");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      const status = error.response?.status;
      const backendMessage =
        error.response?.data?.message ||
        error.response?.data?.error;

      if (status === 409) {
        setErrorMessage(
          backendMessage ||
            "An application with this email or phone number already exists."
        );
      } else {
        setErrorMessage(
          backendMessage ||
            "We could not submit your application. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="career-form-section"
      id="career-application"
    >
      <div className="career-form-container">
        <div className="career-form-heading">
          <span className="career-form-label">JOIN OUR TEAM</span>

          <h2>Apply for a Career at MotorsCube</h2>

          <p>
            Share your details and tell us a little about yourself.
            Our team will review your application.
          </p>
        </div>

        <form className="career-form" onSubmit={handleSubmit}>
          {successMessage && (
            <div className="career-message career-message-success" role="status">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="career-message career-message-error" role="alert">
              {errorMessage}
            </div>
          )}

          <div className="career-form-grid">
            <div className="career-field">
              <label htmlFor="candidate_name">
                Full Name <span>*</span>
              </label>

              <input
                id="candidate_name"
                name="candidate_name"
                type="text"
                placeholder="Enter your full name"
                value={formData.candidate_name}
                onChange={handleChange}
                minLength={2}
                maxLength={255}
                required
              />
            </div>

            <div className="career-field">
              <label htmlFor="candidate_city">
                City <span>*</span>
              </label>

              <input
                id="candidate_city"
                name="candidate_city"
                type="text"
                placeholder="Enter your city"
                value={formData.candidate_city}
                onChange={handleChange}
                minLength={2}
                maxLength={255}
                required
              />
            </div>

            <div className="career-field">
              <label htmlFor="candidate_cell">
                Phone Number <span>*</span>
              </label>

              <input
                id="candidate_cell"
                name="candidate_cell"
                type="tel"
                placeholder="e.g. 03XXXXXXXXX"
                value={formData.candidate_cell}
                onChange={handleChange}
                minLength={7}
                maxLength={30}
                required
              />
            </div>

            <div className="career-field">
              <label htmlFor="candidate_email">
                Email Address <span>*</span>
              </label>

              <input
                id="candidate_email"
                name="candidate_email"
                type="email"
                placeholder="Enter your email address"
                value={formData.candidate_email}
                onChange={handleChange}
                maxLength={255}
                required
              />
            </div>

            <div className="career-field">
              <label htmlFor="candidate_gender">
                Gender <span>*</span>
              </label>

              <select
                id="candidate_gender"
                name="candidate_gender"
                value={formData.candidate_gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="career-field career-field-full">
              <label htmlFor="candidate_msg">
                Message <span className="career-optional">(Optional)</span>
              </label>

              <textarea
                id="candidate_msg"
                name="candidate_msg"
                placeholder="Tell us about your experience, skills, and career interests"
                value={formData.candidate_msg}
                onChange={handleChange}
                rows={5}
              />
            </div>

            <div className="career-field career-field-full">
              <label htmlFor="candidate_cv">
                Upload CV <span className="career-optional">(Optional)</span>
              </label>

              <div className="career-file-upload">
                <input
                  id="candidate_cv"
                  name="candidate_cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleCvChange}
                />

                <p>
                  {cvFile
                    ? `Selected: ${cvFile.name}`
                    : "Accepted formats: PDF, DOC, DOCX"}
                </p>
              </div>

              <small className="career-file-note">
                CV upload will work once the backend supports file uploads.
                The selected file is not uploaded yet.
              </small>
            </div>
          </div>

          <button
            type="submit"
            className="career-submit-button"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default CareerForm;
