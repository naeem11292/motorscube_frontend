import { useState } from "react";
import "../../styles/App.css";


import { Link } from "react-router-dom";




function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    alert("Sign in button clicked!");
  }

  return (
    <div className="auth-page">
      {/* Header */}
      <header className="auth-header">
        <div className="logo">
          Motors<span>Cube</span>
        </div>

        <a href="#" className="web-authentication">
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
              Browse premium vehicles, manage ads, connect with
              traders, and keep your MotorsCube account secure.
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
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
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
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
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
                    {showPassword ? "Hide" : ""}
                  </button>

                </div>

              </div>


             <div className="forgot-container">
             <Link to="/forgot-password">
             Forgot Password?
                   </Link>
            </div>


              {/* Sign in */}
              <button
                type="submit"
                className="signin-button"
              >
                Sign In
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

              {/* <a href="#">
                Sign Up
              </a> */}

              <Link to="/signup">Sign Up</Link>

            </p>

          </div>

        </section>

      </main>
    </div>
  );
}

export default SignIn;