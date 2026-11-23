
import { Link } from "react-router-dom";

function PublicNavbar() {
  return (
    <header className="public-navbar">
      <div className="public-navbar-container">

        {/* Logo */}
        <Link to="/" className="public-logo">
          <span className="logo-motors">MOTORS</span>
          <span className="logo-cube">CUBE</span>
        </Link>

        {/* Navigation */}
        <nav className="public-nav-links">
          <Link to="/">Home</Link>
          <Link to="/business-services">Business Services</Link>
          <Link to="/listing">Buy Vehicles</Link>
          <a href="#vehicle-categories">Vehicle Categories</a>
          <a href="#about-motorscube">About Us</a>
        </nav>

        {/* Authentication */}
        <div className="public-nav-actions">
          <Link to="/login" className="public-login-btn">
            Login
          </Link>

          <Link to="/signup" className="public-register-btn">
            Register
          </Link>
        </div>

      </div>
    </header>
  );
}

export default PublicNavbar;
