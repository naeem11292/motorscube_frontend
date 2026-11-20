
import { useState } from "react";
import "../../styles/App.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

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
      const response = await axios.post(
        "/auth/login",
        {
          user_email: userEmail,
          user_password: password,
        },
        {
          withCredentials: true,
        }
      );

      const accessToken =
        response.data?.data?.access_token ||
        response.data?.access_token;

      if (!accessToken) {
        setError("Login succeeded, but no access token was received.");
        return;
      }

      localStorage.setItem("motorscube_token", accessToken);

      window.dispatchEvent(new Event("auth-changed"));

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Invalid email or password."
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

            <h1>Welcome Back</h1>

            <p>
              Browse premium vehicles, manage ads, connect
              with traders, and keep your MotorsCube account
              secure.
            </p>
          </div>

          <div className="large-ring">
            <div className="small-ring"></div>
          </div>
        </section>

        <section className="signin-card">
          <div className="signin-content">
            <h2>Sign In</h2>

            <p className="subtitle">
              Welcome back. Sign in to continue to MotorsCube.
            </p>

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

              <div className="form-group">
                <label htmlFor="password">Password</label>

                <div className="password-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
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
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div className="forgot-container">
                <Link to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                className="signin-button"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="social-section">
              <p>Or continue with Google / Facebook</p>

              <div className="social-buttons">
                <button type="button">Google</button>
                <button type="button">Facebook</button>
              </div>
            </div>

            <p className="signup-text">
              Don't have an account?{" "}
              <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignIn;
