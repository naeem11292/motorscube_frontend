import heroImg from "../../assets/hero.png";
import "./SellHero.css";

function SellHero() {
  return (
    <section className="sell-hero">
      <div className="sell-hero-content">
        <div className="sell-hero-text">
          <span className="sell-hero-label">MOTORSCUBE</span>

          <h1>
            Sell Your Vehicle
            <span> With Confidence</span>
          </h1>

          <p>
            Reach thousands of buyers and sell your vehicle
            quickly through MotorsCube.
          </p>
        </div>

        <div className="sell-hero-image">
          <img src={heroImg} alt="Sell your vehicle" />
        </div>
      </div>
    </section>
  );
}

export default SellHero;