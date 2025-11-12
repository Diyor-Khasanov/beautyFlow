import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import PrivateRoute from "./components/utils/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
// ... boshqa sahifalarni shu yerga import qilasiz

// Redux orqali til va tema yuklanadi
const App = () => {
  const { theme } = useSelector((state) => state.settings);

  // Theme'ni butun <html> elementiga dinamik qo'yish
  React.useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* ... RegisterPage, VerifyOTPPage */}

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <PrivateRoute allowedRoles={["owner", "master", "client"]} />
          }
        >
          <Route
            index
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            }
          />
          {/* ... Boshqa Protected Routes */}
        </Route>

        <Route
          path="*"
          element={
            <MainLayout>
              <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <h1 className="text-4xl text-text-default">404 | Not Found</h1>
              </div>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
