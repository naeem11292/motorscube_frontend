
import { Link } from "react-router-dom";

function FeaturedVehicles() {
  return (
    <section className="featured-vehicles" id="featured-vehicles">
      <div className="public-section-container">

        <div className="featured-heading">
          <div className="public-section-heading">
            <span>FIND YOUR NEXT VEHICLE</span>
            <h2>Featured Vehicles</h2>
            <p>Explore vehicles available on MotorsCube.</p>
          </div>

          <Link to="/buy" className="view-all-vehicles">
            View All Vehicles →
          </Link>
        </div>

        <div className="featured-empty-state">
          <div className="featured-empty-icon">🚘</div>
          <h3>Discover Vehicles on MotorsCube</h3>
          <p>
            Explore cars, bikes, commercial vehicles,
            machinery and more.
          </p>
          <Link to="/buy" className="featured-browse-btn">
            Browse Vehicles
          </Link>
        </div>

      </div>
    </section>
  );
}

export default FeaturedVehicles;
