import heroImg from "../../assets/hero.png";
import "./HireHero.css";

function HireHero() {
  return (
    <section className="Hire-hero">
      <div className="Hire-hero-content">
        <div className="Hire-hero-text">
          <span className="Hire-hero-label">MOTORSCUBE</span>

          <h1>
            Hire Your Vehicle
            <span> With Confidence</span>
          </h1>

          <p>
            Reach thousands of buyers and sell your vehicle
            quickly through MotorsCube.
          </p>
        </div>

        <div className="sell-hero-image">
          <img src={heroImg} alt="Hire your vehicle" />
        </div>
      </div>
    </section>
  );
}

export default HireHero;