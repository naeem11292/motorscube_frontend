
import saleBanner from "../../assets/sale.banner.png";
import "./HireHero.css";

function HireHero() {
  return (
    <section className="hire-hero">
      <img
        src={saleBanner}
        alt="MotorsCube hire banner"
        className="hire-hero-banner"
      />

      <div className="hire-hero-content">
        <p className="hire-hero-label">Hire The Things</p>

        <h1 className="hire-hero-title">Hire Your Things</h1>

        <p className="hire-hero-description">
          Complete the details below to list your vehicle for hire on
          MotorsCube. Reach thousands of customers and start receiving
          enquiries in just a few simple steps.
        </p>
      </div>
    </section>
  );
}

export default HireHero;
