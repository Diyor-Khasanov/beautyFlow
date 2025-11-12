import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import LoadingPage from "../feedback/LoadingPage";
import ErrorPage from "../feedback/ErrorPage";
import MainLayout from "../layout/MainLayout";
import { t } from "../../utils/i18n";

const PrivateRoute = ({ allowedRoles }) => {
  const { isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth
  );
  const lang = useSelector((state) => state.settings.language);

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <MainLayout>
        <ErrorPage
          title={t("feedback.no_access", lang)}
          message="Sizda ushbu resursga kirish huquqi mavjud emas. Profilingiz: "
          userRole={user.role.toUpperCase()}
        />
      </MainLayout>
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
