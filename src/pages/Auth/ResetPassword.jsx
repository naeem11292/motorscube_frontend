import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";

const API_BASE_URL = "http://localhost:5000/api/v1";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";
  const resetToken = location.state?.resetToken || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !resetToken) {
      setError(
        "Reset session is invalid. Please request a new OTP from Forgot Password."
      );
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter both passwords.");
      return;
    }

    if (password.length < 8 || password.length > 10) {
      setError("Password must be between 8 and 10 characters.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain an uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain a lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain a number.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password`,
        {
          reset_token: resetToken,
          new_password: password,
        }
      );

      console.log(
        "Password reset response:",
        response.data
      );

      alert(
        "Password reset successfully. Please sign in with your new password."
      );

      navigate("/login");
    } catch (error) {
      console.error(
        "Password reset error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <header className="auth-header">
        <div className="logo">
          Motors<span>Cube</span>
        </div>

        <a href="#" className="web-authentication">
          Web Authentication
        </a>
      </header>

      <main className="auth-container">
        <section className="welcome-panel">
          <div className="welcome-content">
            <div className="eyebrow">MOTORSCUBE</div>

            <h1>Reset Password</h1>

            <p>
              Create a new password for your MotorsCube account.
            </p>
          </div>

          <div className="large-ring">
            <div className="small-ring"></div>
          </div>
        </section>

        <section className="signin-card">
          <div className="signin-content">
            <h2>New Password</h2>

            <p className="subtitle">
              Enter your new password below.
            </p>

            {error && (
              <div
                style={{
                  color: "#d32f2f",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">
                  New Password
                </label>

                <div className="password-container">
                  <input
                    id="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    placeholder="Enter new password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div className="password-container">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                  >
                    {showConfirmPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ResetPassword;