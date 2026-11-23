
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Cars",
    description: "Explore new and used cars",
    icon: "🚘",
    path: "/buy?vehicle_type=car",
  },
  {
    name: "Bikes",
    description: "Find your next motorcycle",
    icon: "🏍️",
    path: "/buy?vehicle_type=bike",
  },
  {
    name: "Commercial Vehicles",
    description: "Trucks and commercial vehicles",
    icon: "🚚",
    path: "/buy?vehicle_type=commercial",
  },
  {
    name: "Machinery",
    description: "Explore industrial machinery",
    icon: "🚜",
    path: "/buy?vehicle_type=machinery",
  },
  {
    name: "Plant",
    description: "Find plant and equipment",
    icon: "🏗️",
    path: "/buy?vehicle_type=plant",
  },
];

function VehicleCategories() {
  return (
    <section className="vehicle-categories" id="vehicle-categories">
      <div className="public-section-container">

        <div className="public-section-heading">
          <span>EXPLORE MOTORSCUBE</span>
          <h2>Browse Vehicle Categories</h2>
          <p>Find the right vehicle for your needs.</p>
        </div>

        <div className="vehicle-category-grid">
          {categories.map((category) => (
            <Link
              to={category.path}
              className="vehicle-category-card"
              key={category.name}
            >
              <div className="vehicle-category-icon">
                {category.icon}
              </div>

              <h3>{category.name}</h3>
              <p>{category.description}</p>

              <span className="category-explore">
                Explore →
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

export default VehicleCategories;
