import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../api/authApi";
import { useSelector } from "react-redux";
import { t } from "../../utils/i18n";
import ErrorPage from "../../components/feedback/ErrorPage";

const LoginPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const lang = useSelector((state) => state.settings.language);
  const [login, { isLoading, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ phone, password }).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md bg-bg-secondary rounded-xl shadow-card-dark p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-accent-blue">
            {t("app_name", lang)}
          </h1>
          <p className="text-text-muted mt-2">{t("login.title", lang)}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-default mb-1">
              {t("login.phone", lang)}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="auth-input"
            />
          </div>

          {error && (
            <div className="text-sm text-accent-red bg-accent-red/20 p-3 rounded-lg text-center">
              {error.data?.message || t("feedback.error_title", lang)}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="btn-primary">
            {isLoading
              ? `${t("feedback.loading", lang)}...`
              : t("login.button", lang)}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          {t("login.register_link", lang)}{" "}
          <Link to="/register" className="text-accent-blue hover:underline">
            {t("nav.register", lang) || "Register"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
