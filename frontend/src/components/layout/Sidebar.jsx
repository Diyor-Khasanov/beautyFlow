import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Scissors,
  BarChart3,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "../../utils/i18n";
import { logout } from "../../features/auth/authSlice";
const navItems = [
  {
    nameKey: "dashboard",
    icon: LayoutDashboard,
    path: "/",
    roles: ["owner", "master", "client"],
  },
  {
    nameKey: "schedule",
    icon: Calendar,
    path: "/schedule",
    roles: ["owner", "master"],
  },
  {
    nameKey: "clients",
    icon: Users,
    path: "/clients",
    roles: ["owner", "master"],
  },
  { nameKey: "masters", icon: Scissors, path: "/masters", roles: ["owner"] },
  {
    nameKey: "analytics",
    icon: BarChart3,
    path: "/analytics",
    roles: ["owner"],
  },
];

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.settings.language);

  const handleLogout = () => {
    dispatch(logout());
  };

  const filteredItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-bg-secondary shadow-card-dark z-30 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center" : "justify-between"
        } h-20 px-4 border-b border-border-color`}
      >
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-accent-blue transition-opacity duration-300">
            {t("app_name", lang)}
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-full text-text-muted hover:text-accent-blue hover:bg-bg-primary transition duration-200 ${
            isCollapsed ? "" : "rotate-0"
          }`}
          aria-label="Toggle Sidebar"
        >
          <ChevronLeft
            className={`w-5 h-5 transition-transform ${
              isCollapsed ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      <nav className="mt-6">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.nameKey}
              to={item.path}
              className={`flex items-center mx-3 my-2 p-3 rounded-lg text-sm font-medium transition-colors duration-200
                                ${
                                  isActive
                                    ? "bg-accent-blue text-white shadow-lg"
                                    : "text-text-muted hover:bg-bg-primary hover:text-accent-blue"
                                }
                                ${
                                  isCollapsed
                                    ? "justify-center"
                                    : "justify-start"
                                }
                            `}
              title={isCollapsed ? t(`nav.${item.nameKey}`, lang) : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="ml-4 whitespace-nowrap overflow-hidden">
                  {t(`nav.${item.nameKey}`, lang)}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-4 border-t border-border-color">
        <button
          onClick={handleLogout}
          className={`flex items-center w-full p-3 rounded-lg text-sm font-medium transition-colors duration-200
                        text-accent-red hover:bg-bg-primary ${
                          isCollapsed ? "justify-center" : "justify-start"
                        }`}
          aria-label={t("nav.logout", lang)}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && (
            <span className="ml-4 whitespace-nowrap overflow-hidden">
              {t("nav.logout", lang)}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
