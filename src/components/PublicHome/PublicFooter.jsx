
import { Link } from "react-router-dom";

function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer-container">

        {/* Brand */}
        <div className="public-footer-brand">
          <Link to="/" className="public-footer-logo">
            <span>MOTORS</span>
            <strong>CUBE</strong>
          </Link>

          <p>
            Your complete automotive marketplace.
            Buy, sell, hire and discover automotive
            businesses with MotorsCube.
          </p>
        </div>

        {/* Quick Links */}
        <div className="public-footer-column">
          <h3>Quick Links</h3>
          <Link to="/">Home</Link>
          <Link to="/listing">Vehicle Categories</Link>
          <Link to="/listing">Featured Vehicles</Link>
          <Link to="/business-services">Business Listings</Link>
        </div>

        {/* Business */}
        <div className="public-footer-column">
          <h3>Business Services</h3>
          <Link to="/business/dealerships">Dealerships</Link>
          <Link to="/business/showrooms">Showrooms</Link>
          <Link to="/business/insurance">Insurance</Link>
          <Link to="/business/leasing">Leasing</Link>
          <Link to="/business/workshops">Workshops</Link>
          <Link to="/business/importers">Importers</Link>
          <Link to="/business/exporters">Exporters</Link>
          <Link to="/business/driving-schools">Driving Schools</Link>
        </div>

        {/* Account */}
        <div className="public-footer-column">
          <h3>Your Account</h3>
          <Link to="/login">Login</Link>
          <Link to="/signup">Create Account</Link>
          <Link to="/signup">Join MotorsCube</Link>
        </div>

      </div>

      <div className="public-footer-bottom">
        <p>
          © {new Date().getFullYear()} MotorsCube.
          All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default PublicFooter;
