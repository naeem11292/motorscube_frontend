
import { Link } from "react-router-dom";

const services = [
  {
    icon: "🏢",
    title: "Dealerships",
    description: "Discover vehicle dealerships and their available inventory.",
  },
  {
    icon: "🏬",
    title: "Showrooms",
    description: "Explore vehicle showrooms and their collections.",
  },
  {
    icon: "🛡️",
    title: "Insurance",
    description: "Find vehicle insurance service providers.",
  },
  {
    icon: "💳",
    title: "Leasing",
    description: "Explore vehicle leasing services.",
  },
  {
    icon: "🔧",
    title: "Workshops",
    description: "Find vehicle maintenance and repair workshops.",
  },
  {
    icon: "🚢",
    title: "Importers & Exporters",
    description: "Connect with automotive import and export businesses.",
  },
  {
    icon: "🚗",
    title: "Driving Schools",
    description: "Discover driving schools and their services.",
  },
];

function BusinessServicesSection() {
  return (
    <section className="public-business-services" id="business-services">
      <div className="public-section-container">

        <div className="public-section-heading">
          <span>BUSINESS NETWORK</span>
          <h2>Explore Automotive Business Services</h2>
          <p>
            Everything automotive, all in one place.
            Discover businesses and connect with service providers.
          </p>
        </div>

        <div className="public-business-grid">
          {services.map((service) => (
            <div className="public-business-card" key={service.title}>
              <div className="public-business-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <Link to="/business-listings">
                Explore Service →
              </Link>
            </div>
          ))}
        </div>

        <div className="business-services-action">
          <Link to="/business-listings">
            View All Business Listings
          </Link>
        </div>

      </div>
    </section>
  );
}

export default BusinessServicesSection;
