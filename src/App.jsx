import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Register";
import OTPVerification from "./pages/Auth/OTPVerification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import PasswordResetSuccess from "./pages/Auth/PasswordResetSuccess";

import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import AddSale from "./pages/AddSale/AddSale";
import AddHire from "./pages/AddHire/AddHire";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        <Route
          path="/verify-registration"
          element={<OTPVerification />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/otp-verification"
          element={<OTPVerification />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        <Route
          path="/password-reset-success"
          element={<PasswordResetSuccess />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/add-sale"
          element={
            <ProtectedRoute>
              <Navbar />
              <AddSale />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/add-hire"
          element={
            <ProtectedRoute>
              <Navbar />
              <AddHire />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;