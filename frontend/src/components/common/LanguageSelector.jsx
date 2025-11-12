import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../features/settings/settingSlice";

const languages = [
  { code: "uz", name: "O‘zbek" },
  { code: "en", name: "English" },
  { code: "ru", name: "Русский" },
];

const LanguageSelector = () => {
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.settings.language);

  const handleChange = (e) => {
    dispatch(setLanguage(e.target.value));
  };

  return (
    <div className="relative inline-block text-left">
      <select
        value={lang}
        onChange={handleChange}
        className="
          bg-bg-secondary 
          text-text-default 
          border border-border-color 
          rounded-md 
          shadow-md 
          py-2 px-3 
          focus:outline-none 
          focus:ring-2 focus:ring-accent-blue 
          appearance-none 
          transition duration-200
        "
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.name}
          </option>
        ))}
      </select>
      {/* Custom arrow for appearance-none */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

export default LanguageSelector;
