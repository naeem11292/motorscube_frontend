
import "./CareerForm.css";

function CareerHero() {
  return (
    <section className="career-hero">
      <div className="career-hero-overlay">
        <div className="career-hero-content">
          <span className="career-hero-label">
            CAREERS AT MOTORSCUBE
          </span>

          <h1>
            Build Your Future
            <br />
            With MotorsCube
          </h1>

          <p>
            Take the next step in your professional journey.
            Share your experience and aspirations with our team
            and explore opportunities to grow with MotorsCube.
          </p>

          <a href="#career-application" className="career-hero-button">
            Apply Now
            <span aria-hidden="true"> →</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default CareerHero;
