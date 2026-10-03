import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VerifyRegistration.css";

function VerifyRegistration() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registration email.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/verify-registration-otp",
        {
          user_email: email.trim(),
          otp,
        }
      );

      if (response.data.success) {
        alert("Email verified successfully!");
        navigate("/");
      }
    } catch (err) {
      console.error("OTP verification error:", err);

      setError(
        err.response?.data?.message ||
        "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="otp-page">
      <div className="otp-card">
        <div className="otp-logo">
          Motors<span>Cube</span>
        </div>

        <div className="otp-icon">✉</div>

        <h1>Verify Your Email</h1>

        <p className="otp-description">
          We've sent a 6-digit verification code to your email address.
          Enter the code below to complete your registration.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="otp-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="otp-form-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>

          {error && <p className="otp-error">{error}</p>}

          <button
            type="submit"
            className="otp-button"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <p className="otp-footer">
          Already verified? <Link to="/">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyRegistration;