import React from "react";
import { useSelector } from "react-redux";
import { t } from "../../utils/i18n";

const LoadingPage = () => {
  const lang = useSelector((state) => state.settings.language);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary">
      <div className="w-12 h-12 border-4 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-text-default">
        {t("feedback.loading", lang)}
      </p>
    </div>
  );
};

export default LoadingPage;
