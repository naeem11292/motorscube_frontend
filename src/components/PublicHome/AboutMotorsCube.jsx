
import { Link } from "react-router-dom";

function AboutMotorsCube() {
  const benefits = [
    {
      icon: "🚘",
      title: "Everything Automotive",
      description:
        "Explore vehicles, dealerships, showrooms and automotive services in one platform.",
    },
    {
      icon: "🤝",
      title: "Easy Connections",
      description:
        "Connect with vehicle sellers and automotive service providers.",
    },
    {
      icon: "🔍",
      title: "Easy Discovery",
      description:
        "Find vehicles and services through organized categories.",
    },
    {
      icon: "🌐",
      title: "One Marketplace",
      description:
        "A central place for buying, selling, hiring and discovering automotive services.",
    },
  ];

  return (
    <>
      {/* ABOUT MOTORSCUBE */}
      <section className="about-motorscube" id="about-motorscube">
        <div className="public-section-container about-content">

          <div className="about-text">
            <span className="about-label">ABOUT MOTORSCUBE</span>

            <h2>
              Your Complete Automotive Marketplace
            </h2>

            <p>
              MotorsCube is an automotive marketplace designed
              to bring vehicle buyers, sellers and automotive
              businesses together on one platform.
            </p>

            <p>
              From buying and selling vehicles to exploring
              showrooms, dealerships, insurance, leasing and
              workshops, MotorsCube makes automotive discovery
              easier.
            </p>

            <Link to="/business-listings" className="about-explore-btn">
              Explore MotorsCube
            </Link>
          </div>

          <div className="about-visual">
            <div className="about-visual-icon">🚘</div>
            <h3>MOTORSCUBE</h3>
            <p>Everything Automotive. One Platform.</p>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE MOTORSCUBE */}
      <section className="why-motorscube">
        <div className="public-section-container">

          <div className="public-section-heading">
            <span>WHY MOTORSCUBE</span>
            <h2>Why Choose MotorsCube?</h2>
            <p>
              Discover a convenient way to explore the automotive world.
            </p>
          </div>

          <div className="why-motorscube-grid">
            {benefits.map((benefit) => (
              <div className="why-motorscube-card" key={benefit.title}>
                <div className="why-motorscube-icon">
                  {benefit.icon}
                </div>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>
    </>
  );
}

export default AboutMotorsCube;
