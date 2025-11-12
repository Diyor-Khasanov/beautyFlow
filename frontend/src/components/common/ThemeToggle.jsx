import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Moon, Sun } from "lucide-react";
import { toggleTheme } from "../../features/settings/settingSlice";

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.settings.theme);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const Icon = theme === "dark" ? Sun : Moon;

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full text-text-muted hover:text-accent-blue hover:bg-bg-primary transition duration-200"
      aria-label={`Toggle ${theme === "dark" ? "light" : "dark"} theme`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default ThemeToggle;
