import Navbar from "../Navbar/Navbar";

function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default DashboardLayout;