
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Authentication
import SignIn from "./pages/Auth/Login";
import SignUp from "./pages/Auth/Register";
import OTPVerification from "./pages/Auth/OTPVerification";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import PasswordResetSuccess from "./pages/Auth/PasswordResetSuccess";

// Dashboard
import Dashboard from "./pages/Dashboard/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DashboardLayout from "./components/Layout/DashboardLayout";

// Sale and Hire
import AddSale from "./pages/AddSale/AddSale";
import AddHire from "./pages/AddHire/AddHire";

// Business Services
import Dealership from "./pages/Dealership/Dealership";
import BusinessServices from "./pages/BusinessServices/BusinessServices";

// Store and Marketplace
import Stores from "./pages/Stores/Stores";
import AdAccessories from "./pages/AdAccessories/AdAccessories";
import Messages from "./pages/Messages/Messages";
import MyItems from "./pages/MyItems/MyItems";

// Profile
import Profile from "./pages/Profile/Profile";

// Orders
import MyOrders from "./pages/Orders/MyOrders";
import StoreOrders from "./pages/Orders/StoreOrders";
import OrderDetails from "./pages/Orders/OrderDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==================== AUTHENTICATION ==================== */}

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

        {/* ==================== DASHBOARD ==================== */}

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

        {/* ==================== PROFILE ==================== */}

        <Route
          path="/dashboard/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== SALE ==================== */}

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

        {/* ==================== HIRE ==================== */}

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

        {/* ==================== DEALERSHIP ==================== */}

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

        {/* ==================== BUSINESS SERVICES ==================== */}

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

        {/* ==================== STORES ==================== */}

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

        {/* ==================== ACCESSORIES ==================== */}

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

        {/* ==================== MESSAGES ==================== */}

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

        {/* ==================== MY ITEMS ==================== */}

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

        {/* ==================== ORDERS ==================== */}

        <Route
          path="/dashboard/orders"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <MyOrders />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/orders/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <OrderDetails />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Store owner's order management */}
        <Route
          path="/dashboard/store-orders"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <StoreOrders />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
