import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useVerifyOtpMutation } from "../../api/authApi";
import { t } from "../../utils/i18n";

const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = useSelector((state) => state.settings.language);
  const initialPhone = location.state?.phone || "";

  const [phone, setPhone] = useState(initialPhone);
  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading, error }] = useVerifyOtpMutation();

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!phone || !otp) return;

    try {
      await verifyOtp({ phone, otp }).unwrap();
      navigate("/", { replace: true });
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary p-4">
      <div className="w-full max-w-md bg-bg-secondary rounded-xl shadow-card-dark p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-accent-blue">
            {t("auth.verify_title", lang) || "Verify Code"}
          </h1>
          <p className="text-text-muted mt-2">
            {t("auth.verify_message", lang)?.replace("{phone}", phone) ||
              `Enter the code sent to ${phone}`}
          </p>
        </div>

        <form onSubmit={handleVerification} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-default mb-1">
              {t("login.phone", lang)}
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="99890..."
              required
              className="auth-input"
              disabled={!!initialPhone}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-default mb-1">
              {t("auth.otp_code", lang) || "Verification Code"}
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength="6"
              placeholder="123456"
              required
              className="auth-input text-center text-xl tracking-widest"
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
              : t("auth.verify_button", lang) || "Verify & Continue"}
          </button>
        </form>

        <p className="text-center text-sm text-text-muted">
          {t("auth.no_code", lang) || "Did not receive a code?"}{" "}
          <Link to="#" className="text-accent-blue hover:underline">
            {t("auth.resend", lang) || "Resend Code"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
