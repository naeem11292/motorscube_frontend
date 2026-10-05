
import { useState } from "react";
import "../../styles/App.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1";

function SignIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const userEmail = email.trim();

    // =====================================================
    // BASIC VALIDATION
    // =====================================================

    if (!userEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      // ===================================================
      // LOGIN API
      // ===================================================

      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        {
          user_email: userEmail,
          user_password: password,
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      // ===================================================
      // GET ACCESS TOKEN
      // ===================================================

      const accessToken =
        response.data?.data?.access_token ||
        response.data?.access_token;

      if (!accessToken) {
        setError(
          "Login successful, but access token was not received."
        );
        return;
      }

      // ===================================================
      // SAVE TOKEN
      // ===================================================

      localStorage.setItem(
        "motorscube_token",
        accessToken
      );

      // Notify Navbar / other components
      window.dispatchEvent(
        new Event("auth-changed")
      );

      // ===================================================
      // GO TO DASHBOARD
      // ===================================================

      navigate("/dashboard");

    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      // ===================================================
      // BACKEND ERROR
      // ===================================================

      if (axios.isAxiosError(error)) {
        const backendMessage =
          error.response?.data?.message ||
          error.response?.data?.error;

        setError(
          backendMessage ||
            "Invalid email or password."
        );
      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">

      {/* Header */}
      <header className="auth-header">

        <div className="logo">
          Motors<span>Cube</span>
        </div>

        <a
          href="#"
          className="web-authentication"
        >
          Web Authentication
        </a>

      </header>


      {/* Main content */}
      <main className="auth-container">

        {/* Left side */}
        <section className="welcome-panel">

          <div className="welcome-content">

            <div className="eyebrow">
              MOTORSCUBE
            </div>

            <h1>
              Welcome Back
            </h1>

            <p>
              Browse premium vehicles, manage ads, connect
              with traders, and keep your MotorsCube account
              secure.
            </p>

          </div>

          {/* Decorative circles */}
          <div className="large-ring">
            <div className="small-ring"></div>
          </div>

        </section>


        {/* Right side */}
        <section className="signin-card">

          <div className="signin-content">

            <h2>
              Sign In
            </h2>

            <p className="subtitle">
              Welcome back. Sign in to continue to MotorsCube.
            </p>


            {/* Error message */}
            {error && (
              <div
                role="alert"
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

              {/* Email */}
              <div className="form-group">

                <label htmlFor="email">
                  Email or Mobile Number
                </label>

                <input
                  id="email"
                  type="text"
                  placeholder="Enter email or mobile number"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  disabled={loading}
                />

              </div>


              {/* Password */}
              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-container">

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="show-password"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>


              {/* Forgot password */}
              <div className="forgot-container">

                <Link to="/forgot-password">
                  Forgot Password?
                </Link>

              </div>


              {/* Sign in */}
              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>

            </form>


            {/* Social login */}
            <div className="social-section">

              <p>
                Or continue with Google / Facebook
              </p>

              <div className="social-buttons">

                <button type="button">
                  Google
                </button>

                <button type="button">
                  Facebook
                </button>

              </div>

            </div>


            {/* Sign up */}
            <p className="signup-text">

              Don't have an account?

              {" "}

              <Link to="/signup">
                Sign Up
              </Link>

            </p>

          </div>

        </section>

      </main>

    </div>
  );
}

export default SignIn;
