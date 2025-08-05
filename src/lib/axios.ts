// // lib/axios.ts

// import axios, { AxiosInstance } from "axios";
// import Cookies from "js-cookie";

// // تنظیمات Axios
// const api: AxiosInstance = axios.create({
//   baseURL: "https://srv.xoos.ir",
//   withCredentials: true,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//     "X-Requested-With": "XMLHttpRequest",
//   },
// });

// // Interceptor برای اضافه کردن CSRF توکن
// api.interceptors.request.use((config) => {
//   const csrfToken = Cookies.get("XSRF-TOKEN");
//   if (csrfToken) {
//     config.headers["X-XSRF-TOKEN"] = csrfToken;
//     console.log("🔑 X-XSRF-TOKEN:", csrfToken);
//   }
//   console.log("🍀 Axios Request:", {
//     url: config.url,
//     method: config.method,
//     headers: config.headers,
//     data: config.data,
//   });
//   return config;
// });

// // گرفتن CSRF توکن
// export const getCsrfToken = async (): Promise<void> => {
//   try {
//     const response = await api.get("/sanctum/csrf-cookie");
//     console.log("CSRF Response:", response.status, document.cookie);
//   } catch (error) {
//     console.error("CSRF Error:", error);
//     throw error;
//   }
// };

// // تابع ورود
// export const login = async (email: string, password: string): Promise<any> => {
//   try {
//     await getCsrfToken(); // اول CSRF توکن رو بگیر
//     console.log("🔑 Cookies before login:", document.cookie);
//     const response = await api.post("/api/login", { email, password });
//     console.log("✉️ Login Response:", response.data);
//     if (typeof window !== "undefined") {
//       localStorage.setItem("token", response.data.token);
//     }
//     return response.data;
//   } catch (error: any) {
//     console.error("Login Error:", error.response?.data || error.message);
//     throw error;
//   }
// };
