
import saleBanner from "../../assets/sale.banner.png";
import "./SellHero.css";

function SellHero() {
  return (
    <section className="sell-hero">
      <img
        src={saleBanner}
        alt="MotorsCube car sale banner"
        className="sell-hero-banner"
      />

      <div className="sell-hero-content">
        <p className="sell-hero-label">Sell Car</p>
        <h1 className="sell-hero-title">Sell Your Car</h1>

        <p className="sell-hero-description">
          Complete the details below to list your vehicle on MotorsCube.
          Reach thousands of verified buyers and start receiving offers
          in just a few simple steps.
        </p>
      </div>
    </section>
  );
}

export default SellHero;
