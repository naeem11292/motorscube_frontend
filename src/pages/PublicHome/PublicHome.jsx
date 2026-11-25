
import "./PublicHome.css";

import Navbar from "../../components/Navbar/Navbar";
import HeroSection from "../../components/PublicHome/HeroSection";
import VehicleCategories from "../../components/PublicHome/VehicleCategories";
import FeaturedVehicles from "../../components/PublicHome/FeaturedVehicles";
import BusinessServicesSection from "../../components/PublicHome/BusinessServicesSection";
import AboutMotorsCube from "../../components/PublicHome/AboutMotorsCube";
import PublicFooter from "../../components/PublicHome/PublicFooter";

function PublicHome() {
  return (
    <div className="public-home">
      <Navbar />

      <main>
        <HeroSection />
        <VehicleCategories />
        <FeaturedVehicles />
        <BusinessServicesSection />
        <AboutMotorsCube />
      </main>

      <PublicFooter />
    </div>
  );
}

export default PublicHome;
