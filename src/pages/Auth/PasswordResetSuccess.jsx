import React from "react";
import { useNavigate } from "react-router-dom";
import "./PasswordResetSuccess.css";

const PasswordResetSuccess = () => {
  const navigate = useNavigate();

  const handleGoToSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="prs-page">
      <div className="prs-container">
        {/* Header */}
        <header className="prs-header">
          <div className="prs-logo">
            Motors<span>Cube</span>
          </div>
          <a href="/web-authentication" className="prs-header-link">
            Web Authentication
          </a>
        </header>

        {/* Body */}
        <main className="prs-body">
          {/* Left Hero Card */}
          <section className="prs-hero">
            <span className="prs-hero-tag">SUCCESS</span>
            <h1 className="prs-hero-title">You’re Ready to Sign In</h1>
            <p className="prs-hero-text">
              Your account is secure again. Use the new password the next time
              you sign in to MotorsCube.
            </p>

            <div className="prs-circle prs-circle-outer">
              <div className="prs-circle prs-circle-inner"></div>
            </div>
          </section>

          {/* Right Card */}
          <section className="prs-card">
            <h2 className="prs-card-title">Password Reset Success</h2>
            <p className="prs-card-subtitle">
              Your password has been updated successfully.
            </p>

            <div className="prs-check">
              <span>✓</span>
            </div>

            <h3 className="prs-success-title">Password Reset Successful!</h3>
            <p className="prs-success-text">
              You can now sign in with your new password.
            </p>

            <button className="prs-btn" onClick={handleGoToSignIn}>
              Go to Sign In
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;