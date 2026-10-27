
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SignIn from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Register";
import OTPVerification from "./pages/Auth/OTPVerification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import PasswordResetSuccess from "./pages/Auth/PasswordResetSuccess";

import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "./components/Layout/DashboardLayout";

import AddSale from "./pages/AddSale/AddSale";
import AddHire from "./pages/AddHire/AddHire";
import Dealership from "./pages/Dealership/Dealership";
import BusinessServices from "./pages/BusinessServices/BusinessServices";
import Stores from "./pages/Stores/Stores";
import AdAccessories from "./pages/AdAccessories/AdAccessories";
import Messages from "./pages/Messages/Messages";
import MyItems from "./pages/MyItems/MyItems";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication */}
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

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Sale */}
        <Route
          path="/dashboard/add-sale"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddSale />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Hire */}
        <Route
          path="/dashboard/add-hire"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AddHire />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Dealership */}
        <Route
          path="/dashboard/dealership"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Dealership />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Business Services */}
        <Route
          path="/dashboard/business-services"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BusinessServices />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Stores */}
        <Route
          path="/dashboard/stores"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Stores />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Accessories */}
        <Route
          path="/dashboard/ad-accessories"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdAccessories />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Messages */}
        <Route
          path="/dashboard/messages"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Messages />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* My Items */}
        <Route
          path="/dashboard/my-items"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyItems />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
