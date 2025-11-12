import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useRegisterMutation } from "../../api/authApi";
import { t } from "../../utils/i18n";

const RegisterPage = () => {
  const navigate = useNavigate();
  const lang = useSelector((state) => state.settings.language);

  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    role: "client",
  });

  const [register, { isLoading, error }] = useRegisterMutation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { message } = await register(formData).unwrap();

      if (message && message.includes("OTP")) {
        navigate("/verify-otp", { state: { phone: formData.phone } });
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md bg-bg-secondary rounded-xl shadow-card-dark p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-accent-blue">
            {t("app_name", lang)}
          </h1>
          <p className="text-text-muted mt-2">
            {t("nav.register", lang) || "Register Account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-default mb-1">
              {t("login.phone", lang)}
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="998901234567"
              required
              className="auth-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-default mb-1">
              {t("login.password", lang)}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="auth-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-default mb-1">
              {t("roles.select_role", lang) || "Account Role"}
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="auth-input"
            >
              <option value="client">
                {t("roles.client", lang) || "Client"}
              </option>
              <option value="master">
                {t("roles.master", lang) || "Master"}
              </option>
              <option value="owner">{t("roles.owner", lang) || "Owner"}</option>
            </select>
          </div>

          {error && (
            <div className="text-sm text-accent-red bg-accent-red/20 p-3 rounded-lg text-center">
              {error.data?.message || t("feedback.error_title", lang)}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading
              ? `${t("feedback.loading", lang)}...`
              : t("nav.register", lang) || "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          {t("login.register_link", lang)}{" "}
          <Link to="/login" className="text-accent-blue hover:underline">
            {t("login.button", lang) || "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
