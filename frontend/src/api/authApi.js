import api from "./api";

export const loginUser = async (phone, password) => {
  const { data } = await api.post("/auth/login", { phone, password });
  return data;
};

export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

export const verifyOtp = async (phone, otp) => {
  const { data } = await api.post("/auth/otp/verify", { phone, otp });
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data;
};
