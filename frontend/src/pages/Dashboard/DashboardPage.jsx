import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, Activity } from 'lucide-react';
import { t } from '../../utils/i18n';

const StatCard = ({ title, value, icon: IconComponent, colorClass, link, linkText }) => (
  <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark border-l-4 border-l-accent-blue/50">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">{title}</p>
        <h2 className="text-3xl font-bold text-text-default mt-1">{value}</h2>
      </div>
      <div className={`p-3 rounded-full ${colorClass} bg-opacity-20`}>
        {IconComponent && <IconComponent className={`w-6 h-6 ${colorClass}`} />} 
      </div>
    </div>
    {link && (
      <Link to={link} className="text-xs text-accent-blue hover:underline mt-4 block">
        {linkText}
      </Link>
    )}
  </div>
);

const DashboardPage = () => {
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.settings.language);

  const stats = [
    {
      title: t('dashboard.total_appointments', lang),
      value: "45",
      icon: Calendar,
      colorClass: 'text-accent-blue',
      link: '/schedule',
      linkText: t('dashboard.view_schedule', lang),
    },
    {
      title: t('dashboard.new_clients', lang),
      value: "8",
      icon: Users,
      colorClass: 'text-green-500',
      link: '/clients',
      linkText: t('nav.clients', lang),
    },
    {
      title: t('dashboard.revenue', lang),
      value: "15,200,000",
      icon: DollarSign,
      colorClass: 'text-purple-500',
      link: '/analytics',
      linkText: t('nav.analytics', lang),
    },
    {
      title: t('nav.masters', lang),
      value: user?.role === 'owner' ? '5 / 12' : '1', 
      icon: Activity,
      colorClass: 'text-yellow-500',
      link: user?.role === 'owner' ? '/masters' : null,
      linkText: user?.role === 'owner' ? t('nav.masters', lang) : null,
    },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-text-default">
        {t('dashboard.welcome', lang)} {user?.phone} (Role: <span className="capitalize text-accent-blue">{user?.role}</span>)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark min-h-[400px]">
            <h3 className="text-xl font-semibold text-text-default mb-4">
              {t('dashboard.summary', lang)}: Booking Trends
            </h3>
            <div className="flex items-center justify-center h-[300px] border border-border-color border-dashed rounded-lg text-text-muted">
              {t('dashboard.summary', lang)} uchun chiroyli grafik joylashadi
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-bg-secondary p-6 rounded-xl shadow-card-dark min-h-[400px]">
            <h3 className="text-xl font-semibold text-text-default mb-4">
              Latest Activity / Quick Actions
            </h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="p-3 bg-bg-primary rounded-lg border border-border-color hover:border-accent-blue transition">New Client registered: J. Doe</li>
              <li className="p-3 bg-bg-primary rounded-lg border border-border-color hover:border-accent-blue transition">Appointment cancelled: Master X</li>
              <li className="p-3 bg-bg-primary rounded-lg border border-border-color hover:border-accent-blue transition">Master Y needs approval for time off.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;