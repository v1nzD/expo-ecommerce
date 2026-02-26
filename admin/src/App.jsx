import React from "react";
import { Navigate, Route, Routes } from "react-router";
import { useAuth } from "@clerk/clerk-react";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import CustomersPage from "./pages/CustomerPage";

const App = () => {
  const { isSignedIn } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isSignedIn ? <Navigate to={"/dashboard"} /> : <LoginPage />}
      />

      {/* Page layout */}
      <Route
        path="/"
        element={isSignedIn ? <DashboardLayout /> : <Navigate to={"/login"} />}
      >
        <Route index element={<Navigate to={"dashboard"} />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
      </Route>
    </Routes>
  );
};

export default App;
