import React from "react";
import { AlertTriangle } from "lucide-react";

const ErrorPage = ({
  title = "Error",
  message = "Something went wrong.",
  userRole,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-8 bg-bg-secondary rounded-xl shadow-card-dark m-8">
      <AlertTriangle className="w-16 h-16 text-accent-red" />
      <h1 className="mt-4 text-3xl font-bold text-text-default">{title}</h1>
      <p className="mt-2 text-text-muted text-center">{message}</p>
      {userRole && (
        <p className="mt-4 px-4 py-2 bg-accent-red/20 text-accent-red rounded-full text-sm font-medium">
          {userRole}
        </p>
      )}
    </div>
  );
};

export default ErrorPage;
