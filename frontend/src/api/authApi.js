import { apiSlice } from "./apiSlice";
import { setCredentials, setLoading, logout } from "../features/auth/authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          await dispatch(authApi.endpoints.getProfile.initiate());
        } catch (error) {
          dispatch(logout());
          console.log(error.data.message);
        }
      },
    }),

    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...userData },
      }),
    }),

    verifyOtp: builder.mutation({
      query: ({ phone, otp }) => ({
        url: "/auth/otp/verify",
        method: "POST",
        body: { phone, otp },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          await dispatch(authApi.endpoints.getProfile.initiate());
        } catch (error) {
          dispatch(logout());
          console.log(error.data.message);
        }
      },
    }),

    getProfile: builder.query({
      query: () => "/users/profile",
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: { id: data._id, role: data.role, phone: data.phone },
            })
          );
        } catch (error) {
          dispatch(logout());
          console.log(error.data.message);
        } finally {
          dispatch(setLoading(false));
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useGetProfileQuery,
} = authApi;
