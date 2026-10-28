
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const modules = [
    {
      name: "Stores",
      description: "Manage your MotorsCube stores.",
      icon: "🛍️",
      path: "/dashboard/stores",
    },
    {
      name: "My Items",
      description: "View and manage all your sale and hire ads.",
      icon: "🚘",
      path: "/dashboard/my-items",
    },
    {
      name:"User Wallet",
      description:"View and manage",
      icon:"🚘",
      path:"/dashboard/my-items",
    }
  ];

  return (
    <div
      style={{
        padding: "30px",
        background: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <h1>MotorsCube Dashboard</h1>
      <p style={{ color: "#64748b", marginBottom: "25px" }}>
        Manage your MotorsCube activities from one place.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
        }}
      >
        {modules.map((module) => (
          <div
            key={module.name}
            onClick={() => navigate(module.path)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                navigate(module.path);
              }
            }}
            role="button"
            tabIndex={0}
            style={{
              background: "#fff",
              padding: "28px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              color: "#172033",
              cursor: "pointer",
              transition: "box-shadow 0.2s, transform 0.2s",
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.boxShadow =
                "0 8px 24px rgba(15, 23, 42, 0.08)";
              event.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.boxShadow = "none";
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "16px" }}>
              {module.icon}
            </div>

            <h2 style={{ margin: "0 0 10px", fontSize: "21px" }}>
              {module.name}
            </h2>

            <p
              style={{
                margin: 0,
                color: "#64748b",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              {module.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
