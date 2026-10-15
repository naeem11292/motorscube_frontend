
import HireHero from "../../components/AddHire/HireHero";
import "./AddHire.css";

function AddHire() {
  return (
    <main className="add-hire-page">
      <HireHero />

      <div className="add-hire-container">
        <div className="add-hire-heading">
          <h1>Hire a Vehicle or Equipment</h1>
          <p>
            List your vehicle or equipment for hire on MotorsCube.
          </p>
        </div>

        <form className="add-hire-form">
          {/* Vehicle type selector goes here */}

          {/* Basic information goes here */}

          {/* Vehicle details go here */}

          {/* Hire charges go here */}

          {/* Image upload goes here */}

          {/* Description goes here */}

          <button type="submit" className="add-hire-submit">
            Publish Hire Ad
          </button>
        </form>
      </div>
    </main>
  );
}

export default AddHire;
