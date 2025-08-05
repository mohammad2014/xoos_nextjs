"use server";

import axios from "axios";
import { api, getCsrfToken } from "../api";

export const registerStepOne = async (
  mobile: string,
  recaptcha_token: string,
  remember_me: boolean
) => {
  try {
    await getCsrfToken();
    const { data } = await api.post("/api/auth/register/step-one", {
      mobile,
      recaptcha_token,
      remember_me,
    });
    console.log(data);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};

export async function verifyCode({
  mobile,
  session_token,
  verifyCode,
}: {
  mobile: string;
  session_token: string;
  verifyCode: string;
}) {
  try {
    await getCsrfToken();
    const { data } = await api.post("/api/auth/verify-otp-register", {
      mobile,
      session_token,
      verifyCode,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
}

export async function requestOtp(mobile: string, session_token: string) {
  try {
    await getCsrfToken();

    const { data } = await api.post("/api/auth/request-otp", {
      mobile,
      session_token,
    });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
}

interface LoginWithPasswordParams {
  mobile: string;
  password: string;
  session_token: string;
}

export const loginWithPassword = async ({
  mobile,
  password,
  session_token,
}: LoginWithPasswordParams) => {
  try {
    await getCsrfToken();

    const { data } = await api.post("/api/auth/login-with-password", {
      mobile,
      password,
      session_token,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      return errData;
    }
  }
};
