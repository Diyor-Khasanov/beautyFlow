import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetProfileQuery } from "./api/authApi";
import PrivateRoute from "./components/utils/PrivateRoute";
import MainLayout from "./components/layout/MainLayout";
import LoginPage from "./pages/Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import LoadingPage from "./components/feedback/LoadingPage";
import RegisterPage from './pages/Auth/RegisterPage';
import VerifyOTPPage from './pages/Auth/VerifyOTPPage';

const App = () => {
  const { theme } = useSelector((state) => state.settings);
  const { isLoading } = useSelector((state) => state.auth);

  useGetProfileQuery();

  React.useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);
  
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        
        <Route path="/" element={<PrivateRoute allowedRoles={['owner', 'master', 'client']} />}>
          <Route index element={<MainLayout><DashboardPage /></MainLayout>} />
          {/* ... Boshqa protected routes... */}
        </Route>
        
        <Route path="*" element={<MainLayout>
          <div className="flex justify-center items-center h-[calc(100vh-80px)]">
            <h1 className="text-4xl text-text-default">404 | Not Found</h1>
          </div>
        </MainLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
