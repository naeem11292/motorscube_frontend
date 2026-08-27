import { useState } from "react";
import "./SignUp.css";

import { Link } from "react-router-dom";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    accountType: "",
    countryCode: "+92",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    console.log(formData);

    alert("Account creation submitted!");
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

            {/* Row 1 */}
            <div className="form-row">

              <div className="form-group">
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>


              <div className="form-group">
                <label htmlFor="accountType">
                  Account Type
                </label>

                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Private or Trader / Business
                  </option>

                  <option value="private">
                    Private
                  </option>

                  <option value="trader">
                    Trader / Business
                  </option>
                </select>
              </div>

            </div>


            {/* Row 2 */}
            <div className="form-row">

              <div className="form-group">
                <label htmlFor="countryCode">
                  Country Code
                </label>

                <select
                  id="countryCode"
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                >
                  <option value="+92">
                    Pakistan +92
                  </option>

                  <option value="+1">
                    USA +1
                  </option>

                  <option value="+44">
                    UK +44
                  </option>
                </select>
              </div>


              <div className="form-group">
                <label htmlFor="mobile">
                  Mobile Number
                </label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  placeholder="Enter mobile number"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

            </div>


            {/* Email */}
            <div className="form-group full-width">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
              />

            </div>


            {/* Password Row */}
            <div className="form-row">

              <div className="form-group">

                <label htmlFor="password">
                  Password
                </label>

                <div className="password-wrapper">

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="password-toggle"
                  >
                    {showPassword ? "Hide" : ""}
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
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="password-toggle"
                  >
                    {showConfirmPassword ? "Hide" : ""}
                  </button>

                </div>

              </div>

            </div>


            {/* Password requirements */}
            <p className="password-hint">
              Password: minimum 8 characters, uppercase, lowercase,
              and a number or special character.
            </p>


            {/* Submit */}
            <button
              type="submit"
              className="create-account-button"
            >
              Create Account &amp; Send OTP
            </button>

          </form>


          {/* Sign In */}
          <p className="signin-link">
            Already have an account?{" "}
            {/* <a href="/">
              Sign In
            </a> */}

            <Link to="/">Sign In</Link>
          </p>

        </div>

      </section>

    </div>
  );
}

export default SignUp;
