
import { Link } from "react-router-dom";
import "./FeaturedVehicles.css";

const vehicles = [
  {
    id: 1,
    name: "Toyota Corolla Altis",
    variant: "1.6 Automatic",
    price: "PKR 34.5 Lacs",
    city: "Islamabad",
    year: "2018",
    fuel: "Petrol",
    image:
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Toyota Prius",
    variant: "1.8 Hybrid",
    price: "PKR 21 Lacs",
    city: "Islamabad",
    year: "2014",
    fuel: "Hybrid",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Suzuki Swift",
    variant: "1.3 Manual",
    price: "PKR 15 Lacs",
    city: "Islamabad",
    year: "2011",
    fuel: "Petrol",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85",
  },
];

function FeaturedVehicles() {
  return (
    <section className="featured-vehicles" id="featured-vehicles">
      <div className="public-section-container">

        <div className="featured-heading">
          <div className="public-section-heading">
            <span>FIND YOUR NEXT VEHICLE</span>
            <h2>Premium Cars For Sale</h2>
            <p>
              Explore quality vehicles and discover your next ride
              on MotorsCube.
            </p>
          </div>

          <Link to="/buy" className="view-all-vehicles">
            View All Cars <span>→</span>
          </Link>
        </div>

        <div className="featured-vehicle-grid">
          {vehicles.map((vehicle) => (
            <article className="featured-vehicle-card" key={vehicle.id}>
              <div className="featured-vehicle-image">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  loading="lazy"
                />
                <span className="demo-listing-badge">Demo Listing</span>
              </div>

              <div className="featured-vehicle-content">
                <h3>{vehicle.name}</h3>
                <p className="featured-vehicle-variant">
                  {vehicle.variant}
                </p>

                <div className="featured-vehicle-price">
                  {vehicle.price}
                </div>

                <div className="featured-vehicle-details">
                  <span>📍 {vehicle.city}</span>
                  <span>📅 {vehicle.year}</span>
                  <span>⛽ {vehicle.fuel}</span>
                </div>

                <Link to="/buy" className="featured-details-btn">
                  View All Details <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}

export default FeaturedVehicles;
