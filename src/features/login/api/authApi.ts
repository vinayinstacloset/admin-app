import { getApiErrorMessage } from "../../../shared/api/apiError";
import { authClient } from "../../../shared/api/auth/authClient";
import {
  ADMIN_EMAIL_KEY,
  ADMIN_ID_KEY,
  ADMIN_NAME_KEY,
  ADMIN_MOBILE_KEY,
} from "../../../config/env";
import { useAuthStore } from "../../../store/zustand/authStore";
import type {
  SendLoginOtpRequest,
  SendLoginOtpResponse,
  VerifyLoginOtpRequest,
  VerifyLoginOtpResponse,
} from "../types/auth.types";

function persistAdminDetails(data: VerifyLoginOtpResponse): void {
  const adminReferenceId = data.adminReferenceId ?? data.admin?.id;
  const name = data.name ?? data.admin?.name;
  const email = data.email ?? data.admin?.email;
  const mobile = data.mobile ?? data.admin?.mobile;
  const role = data.role ?? data.admin?.role;

  if (adminReferenceId !== undefined && adminReferenceId !== null) {
    localStorage.setItem(ADMIN_ID_KEY, String(adminReferenceId));
  }

  if (email) {
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
  }

  if (name) {
    localStorage.setItem(ADMIN_NAME_KEY, name);
  }

  if (mobile) {
    localStorage.setItem(ADMIN_MOBILE_KEY, mobile);
  }

  useAuthStore.getState().setAdmin({
    id: adminReferenceId == null ? null : String(adminReferenceId),
    name: name ?? null,
    email: email ?? null,
    role: role ?? null,
  });
}

export const authService = {
  sendOtp: async (
    payload: SendLoginOtpRequest,
  ): Promise<SendLoginOtpResponse> => {
    try {
      const { data } = await authClient.post<SendLoginOtpResponse>(
        "/auth/admin/login/send-otp",
        payload,
      );

      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(error, "Failed to send OTP. Please try again."),
      );
    }
  },

  verifyOtp: async (
    payload: VerifyLoginOtpRequest,
  ): Promise<VerifyLoginOtpResponse> => {
    try {
      const { data } = await authClient.post<VerifyLoginOtpResponse>(
        "/auth/admin/login",
        payload,
      );

      const accessToken = data.accessToken ?? data.token;
      const refreshToken = data.refreshToken;

      if (!accessToken || !refreshToken) {
        throw new Error(
          "Login response did not include both access and refresh tokens.",
        );
      }

      useAuthStore.getState().setTokens({
        accessToken,
        refreshToken,
      });

      persistAdminDetails(data);

      useAuthStore.getState().setAuthenticated(true);

      return data;
    } catch (error) {
      throw new Error(
        getApiErrorMessage(
          error,
          error instanceof Error
            ? error.message
            : "Invalid or expired OTP. Please try again.",
        ),
      );
    }
  },

  logout: async (): Promise<void> => {
    try {
      await authClient.post("/auth/admin/logout");
    } catch (error) {
      console.error("Admin logout request failed:", error);
    } finally {
      useAuthStore.getState().clearAuth();

      localStorage.removeItem(ADMIN_ID_KEY);
      localStorage.removeItem(ADMIN_EMAIL_KEY);
      localStorage.removeItem(ADMIN_NAME_KEY);
      localStorage.removeItem(ADMIN_MOBILE_KEY);

      localStorage.clear();
    }
  },

  isAuthenticated: (): boolean => Boolean(useAuthStore.getState().accessToken),
};
