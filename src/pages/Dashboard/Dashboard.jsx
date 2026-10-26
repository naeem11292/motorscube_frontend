
function Dashboard() {
  return (
    <div style={{ padding: "30px", background: "#f7f8fa", minHeight: "100vh" }}>
      <h1>MotorsCube Dashboard</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: "20px"
      }}>
        {["Add Sale", "Add Hire", "Dealership", "Insurance", "Leasing", "Workshop", "Importer", "Exporter", "Driving School", "Stores"].map((name) => (
          <div key={name} style={{
            background: "white",
            padding: "30px",
            border: "1px solid #ddd",
            borderRadius: "12px",
            color: "#172033"
          }}>
            <h2>{name}</h2>
            <p>Manage your {name.toLowerCase()} module.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
