import React from "react";
import { useSelector } from "react-redux";
import { Scissors, Search, PlusCircle, UserCheck } from "lucide-react";
import { t } from "../../utils/i18n";

const MastersPage = () => {
  const lang = useSelector((state) => state.settings.language);
  const userRole = useSelector((state) => state.auth.user?.role);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-default flex items-center space-x-3">
        <Scissors className="w-7 h-7 text-accent-blue" />
        <span>{t("nav.masters", lang)}</span>

        {userRole === "owner" && (
          <span className="text-base text-accent-red">
            ({t("roles.owner", lang)} Ruxsati)
          </span>
        )}
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center bg-bg-secondary p-4 rounded-xl shadow-card-dark border-b border-border-color space-y-3 sm:space-y-0">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder={
              t("masters.search_placeholder", lang) ||
              "Master ismini qidirish..."
            }
            className="pl-10 pr-4 py-2 w-full rounded-lg bg-bg-primary border border-border-color 
                       text-text-default text-sm focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
        </div>

        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-opacity-90 transition duration-200 text-sm">
            <PlusCircle className="w-5 h-5" />
            <span>{t("masters.add_new", lang) || "Yangi Master qo‘shish"}</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-bg-primary text-text-default border border-border-color rounded-lg hover:border-accent-blue transition duration-200 text-sm">
            <UserCheck className="w-5 h-5 text-green-500" />
            <span>
              {t("masters.pending_requests", lang) || "Kutilayotganlar"}
            </span>
          </button>
        </div>
      </div>

      <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark min-h-[60vh] overflow-x-auto">
        <h2 className="text-xl font-semibold text-text-default mb-4 border-b border-border-color pb-3">
          {t("masters.list_title", lang) || "Masterlar Ro‘yxati"}
        </h2>

        <div className="w-full">
          <table className="min-w-full divide-y divide-border-color">
            <thead>
              <tr className="text-left text-sm text-text-muted uppercase">
                <th className="py-3 pr-2">#</th>
                <th className="py-3 px-2">
                  {t("clients.name", lang) || "Ism"}
                </th>
                <th className="py-3 px-2">
                  {t("masters.specialization", lang) || "Mutaxassislik"}
                </th>
                <th className="py-3 px-2 hidden md:table-cell">
                  {t("masters.status", lang) || "Holat"}
                </th>
                <th className="py-3 px-2 hidden lg:table-cell">
                  {t("masters.appointments_today", lang) ||
                    "Bugungi yozilishlar"}
                </th>
                <th className="py-3 pl-2 text-right">
                  {t("clients.actions", lang) || "Amallar"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color text-text-default">
              <tr className="hover:bg-bg-primary/50 transition duration-150 text-sm">
                <td className="py-4 pr-2">1</td>
                <td className="py-4 px-2 font-medium">Lola Ahmedova</td>
                <td className="py-4 px-2">Hair Stylist</td>
                <td className="py-4 px-2 hidden md:table-cell text-green-500 font-semibold">
                  Active
                </td>
                <td className="py-4 px-2 hidden lg:table-cell">5</td>
                <td className="py-4 pl-2 text-right">
                  <button className="text-accent-blue hover:text-accent-red text-sm">
                    View
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-bg-primary/50 transition duration-150 text-sm">
                <td className="py-4 pr-2">2</td>
                <td className="py-4 px-2 font-medium">Javlon Saidov</td>
                <td className="py-4 px-2">Barber</td>
                <td className="py-4 px-2 hidden md:table-cell text-yellow-500 font-semibold">
                  On Leave
                </td>
                <td className="py-4 px-2 hidden lg:table-cell">0</td>
                <td className="py-4 pl-2 text-right">
                  <button className="text-accent-blue hover:text-accent-red text-sm">
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="mt-8 text-center text-text-muted border border-dashed border-border-color p-8 rounded-lg">
            <p>
              {t("masters.table_placeholder", lang) ||
                "Masterlar ma’lumotlarining dinamik jadvali shu yerda joylashadi."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MastersPage;
