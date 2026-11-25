
import { useState } from "react";
import { Link } from "react-router-dom";
import "./HeroSection.css";

function HeroSection() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [city, setCity] = useState("");
  const [carType, setCarType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (make) params.set("make", make);
    if (model) params.set("model", model);
    if (city) params.set("city", city);

    window.location.href = `/listing?${params.toString()}`;
  };

  return (
    <section className="elite-hero">
      <div className="elite-hero-overlay">
        <div className="elite-hero-container">

          <div className="elite-brand">
            <span className="elite-brand-icon"></span>
            <span></span>
          </div>

          <div className="elite-heading">
            <span className="elite-eyebrow">WELCOME TO MOTORSCUBE</span>
            <h1>Elite Car Search</h1>
            <p>
              Find your perfect car in just a few clicks.
            </p>
          </div>

          <div className="elite-search-panel">
            <div className="elite-search-title">
              <div>
                <h2>Find Your Dream Car</h2>
                <span>Search Cars 32</span>
              </div>
            </div>

            <div className="elite-search-fields">
              <label>
                Car Make
                <select value={make} onChange={(e) => {
                  setMake(e.target.value);
                  setModel("");
                }}>
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="Suzuki">Suzuki</option>
                  <option value="Nissan">Nissan</option>
                  <option value="BMW">BMW</option>
                  <option value="Audi">Audi</option>
                </select>
              </label>

              <label>
                Car Model
                <select value={model} onChange={(e) => setModel(e.target.value)}>
                  <option value="">Select Model</option>
                  <option value="Corolla">Corolla</option>
                  <option value="Civic">Civic</option>
                  <option value="Prius">Prius</option>
                  <option value="Swift">Swift</option>
                  <option value="City">City</option>
                </select>
              </label>

              <label>
                City
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Select City</option>
                  <option value="Islamabad">Islamabad</option>
                  <option value="Rawalpindi">Rawalpindi</option>
                  <option value="Lahore">Lahore</option>
                  <option value="Karachi">Karachi</option>
                  <option value="Peshawar">Peshawar</option>
                </select>
              </label>

              <button type="button" onClick={handleSearch}>
                Search Cars <span>→</span>
              </button>
            </div>
          </div>

          <div className="premium-search">
            <div className="premium-search-heading">
              <span>PREMIUM RIDES</span>
              <h2>Drive the Legacy of Luxury</h2>
              <p>
                Discover premium cars, trusted dealers, and a seamless
                buying experience, all in one place.
              </p>
            </div>

            <div className="premium-search-fields">
              <label>
                Car Type
                <select value={carType} onChange={(e) => setCarType(e.target.value)}>
                  <option value="">Select Type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </label>

              <label>
                Car Make
                <select value={make} onChange={(e) => setMake(e.target.value)}>
                  <option value="">Select Make</option>
                  <option value="Toyota">Toyota</option>
                  <option value="Honda">Honda</option>
                  <option value="BMW">BMW</option>
                  <option value="Mercedes">Mercedes-Benz</option>
                  <option value="Audi">Audi</option>
                </select>
              </label>

              <label>
                Min Price (PKR)
                <input
                  type="number"
                  placeholder="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                />
              </label>

              <label>
                Max Price (PKR)
                <input
                  type="number"
                  placeholder="50000000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                />
              </label>

              <Link
                to={`/listing?type=${encodeURIComponent(carType)}&make=${encodeURIComponent(make)}&minPrice=${minPrice}&maxPrice=${maxPrice}`}
                className="premium-search-button"
              >
                Explore Premium Cars →
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;
