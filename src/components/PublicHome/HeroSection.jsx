
import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="public-hero">
      <div className="public-hero-overlay">
        <div className="public-hero-content">

          <span className="hero-tagline">
            WELCOME TO MOTORSCUBE
          </span>

          <h1>
            Drive the Legacy.
            <br />
            Own the Future.
          </h1>

          <p>
            Your complete automotive marketplace.
            Discover vehicles, explore business services,
            and find everything automotive in one place.
          </p>

          <div className="hero-buttons">
            <Link to="/listing" className="hero-primary-btn">
              Explore Vehicles
            </Link>

            <Link to="/signup" className="hero-secondary-btn">
              Join MotorsCube
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
