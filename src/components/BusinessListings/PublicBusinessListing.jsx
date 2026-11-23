
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

function PublicBusinessListing({ title, description }) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "80vh",
          padding: "50px 6%",
          background: "#f6f8fb",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <button
          onClick={() => navigate("/business-services")}
          style={{
            border: "none",
            background: "none",
            color: "#2865d7",
            cursor: "pointer",
            marginBottom: "25px",
            fontSize: "15px",
          }}
        >
          ← Back to Business Services
        </button>

        <div
          style={{
            background: "linear-gradient(135deg, #101828, #24364b)",
            color: "white",
            borderRadius: "18px",
            padding: "40px",
            marginBottom: "35px",
          }}
        >
          <h1 style={{ marginTop: 0, fontSize: "32px" }}>
            {title}
          </h1>

          <p style={{ color: "#d1d9e6", lineHeight: 1.7 }}>
            {description}
          </p>
        </div>

        <section
          style={{
            background: "#fff",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
            border: "1px solid #e7ebf1",
          }}
        >
          <h2 style={{ color: "#172033" }}>Explore {title}</h2>

          <p style={{ color: "#737c8d" }}>
            Business listings will appear here once we connect this
            directory to its public API.
          </p>
        </section>
      </main>
    </>
  );
}

export default PublicBusinessListing;
