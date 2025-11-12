import React from "react";
import { useSelector } from "react-redux";
import { Calendar, PlusCircle, Filter } from "lucide-react";
import { t } from "../../utils/i18n";

const SchedulePage = () => {
  const lang = useSelector((state) => state.settings.language);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-default flex items-center space-x-3">
        <Calendar className="w-7 h-7 text-accent-blue" />
        <span>{t("nav.schedule", lang)}</span>
      </h1>

      <div className="flex justify-between items-center bg-bg-secondary p-4 rounded-xl shadow-card-dark border-b border-border-color">
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-opacity-90 transition duration-200 text-sm">
            <PlusCircle className="w-5 h-5" />
            <span>
              {t("schedule.new_appointment", lang) || "Yangi yozilish"}
            </span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-bg-primary text-text-default border border-border-color rounded-lg hover:border-accent-blue transition duration-200 text-sm">
            <Filter className="w-5 h-5" />
            <span>{t("schedule.filter", lang) || "Filtrlash"}</span>
          </button>
        </div>

        <div className="hidden sm:flex space-x-2 text-sm">
          <button className="px-3 py-1 rounded-lg bg-accent-blue text-white">
            Week
          </button>
          <button className="px-3 py-1 rounded-lg bg-bg-primary text-text-muted hover:text-text-default">
            Day
          </button>
          <button className="px-3 py-1 rounded-lg bg-bg-primary text-text-muted hover:text-text-default">
            Month
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark min-h-[70vh]">
        <h2 className="text-xl font-semibold text-text-default mb-4 border-b border-border-color pb-3">
          {t("schedule.current_view", lang) || "Haftalik Jadval"}
          {user?.role === "owner" && (
            <span className="text-sm text-text-muted ml-3">(All Masters)</span>
          )}
        </h2>

        <div className="flex items-center justify-center h-[60vh] border border-border-color border-dashed rounded-lg text-text-muted">
          <p className="text-lg">
            {t("schedule.calendar_placeholder", lang) ||
              "To‘liq Kalendar Komponenti (Masalan, FullCalendar yoki React Big Calendar) shu yerda joylashadi"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
