import React from "react";
import { useSelector } from "react-redux";
import { BarChart3, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { t } from "../../utils/i18n";

const AnalyticsPage = () => {
  const lang = useSelector((state) => state.settings.language);
  const KpiCard = ({ title, value, change, icon: IconComponent, color }) => (
    <div className="bg-bg-secondary p-5 rounded-xl shadow-card-dark border border-border-color">
      <p className="text-sm text-text-muted uppercase font-medium">{title}</p>
      <h3 className="text-3xl font-bold text-text-default mt-1">{value}</h3>
      <div className={`flex items-center text-sm mt-2 ${color}`}>
        {IconComponent && <IconComponent className="w-4 h-4 mr-1" />}
        <span>{change}</span>
      </div>
    </div>
  );

  const kpis = [
    {
      title: t("analytics.conversion_rate", lang) || "Konversiya",
      value: "18.5%",
      change: "+3.1%",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: t("analytics.churn_rate", lang) || "Mijoz Yo'qotish",
      value: "4.2%",
      change: "-0.9%",
      icon: TrendingDown,
      color: "text-accent-red",
    },
    {
      title: t("analytics.avg_visit_time", lang) || "O'rtacha Tashrif",
      value: "45 min",
      change: "±0%",
      icon: Clock,
      color: "text-yellow-500",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-default flex items-center space-x-3">
        <BarChart3 className="w-7 h-7 text-accent-blue" />
        <span>{t("nav.analytics", lang)}</span>
        <span className="text-base text-accent-red">
          ({t("roles.owner", lang)} Ruxsati)
        </span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark min-h-[450px]">
          <h3 className="text-xl font-semibold text-text-default mb-4 border-b border-border-color pb-3">
            {t("analytics.revenue_over_time", lang) || "Daromad Dinamikasi"}
          </h3>
          <div className="flex items-center justify-center h-[350px] border border-border-color border-dashed rounded-lg text-text-muted">
            {t("analytics.graph_placeholder", lang) || "Daromad oqimi grafigi"}
          </div>
        </div>

        <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark min-h-[450px]">
          <h3 className="text-xl font-semibold text-text-default mb-4 border-b border-border-color pb-3">
            {t("analytics.services_analysis", lang) ||
              "Xizmatlar bo‘yicha tahlil"}
          </h3>
          <div className="flex items-center justify-center h-[350px] border border-border-color border-dashed rounded-lg text-text-muted">
            {t("analytics.graph_placeholder", lang) ||
              "Xizmatlar ulushi (Pie chart) shu yerda bo‘ladi"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
