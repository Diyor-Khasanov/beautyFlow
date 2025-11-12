import React from "react";
import { Bell, Search, Menu, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import ThemeToggle from "../common/ThemeToggle";
import LanguageSelector from "../common/LanguageSelector";
import { t } from "../../utils/i18n";

const Header = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((state) => state.settings.language);

  const handleLogout = () => {
    dispatch(logout());
  };

  const getInitials = (phone) => {
    return phone ? phone.slice(-4) : "US";
  };

  return (
    <header
      className="fixed top-0 w-full h-20 
                       flex items-center justify-between px-6 
                       bg-bg-secondary/90 backdrop-blur-sm 
                       border-b border-border-color z-20 
                       transition-all duration-300"
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full text-text-muted hover:text-accent-blue hover:bg-bg-primary transition duration-200"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="relative hidden lg:block">
          <input
            type="text"
            placeholder={`Search...`}
            className="pl-10 pr-4 py-2 w-72 rounded-full bg-bg-primary border border-border-color 
                       text-text-default text-sm focus:ring-2 focus:ring-accent-blue focus:border-accent-blue outline-none"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <LanguageSelector />

        <ThemeToggle />

        <button
          className="p-2 rounded-full text-text-muted hover:text-accent-blue hover:bg-bg-primary transition duration-200 relative"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-accent-red rounded-full"></span>
        </button>

        {user && (
          <div className="flex items-center space-x-3">
            <div
              className="w-10 h-10 rounded-full bg-accent-blue flex items-center justify-center 
                            text-white font-bold text-sm shadow-md"
            >
              {getInitials(user.phone)}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium text-text-default">
                {user.phone}
              </p>
              <p className="text-xs text-text-muted capitalize">{user.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-accent-red hover:bg-bg-primary transition duration-200"
              title={t("nav.logout", lang)}
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
