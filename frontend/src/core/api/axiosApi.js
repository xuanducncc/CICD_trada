import axios from "axios";

const baseURL = process.env.API_URL;

const axiosAPI = axios.create({
  baseURL: baseURL,
  timeout: 50000,
  headers: {
    accept: "application/json",
  },
});

axiosAPI.interceptors.request.use(function (config) {
  if (!config.url.includes("oauth")) {
    const accessToken = localStorage.getItem("access_token");
    const accessHeader = accessToken ? "Bearer " + accessToken : null;
    if (accessHeader) {
      config.headers.Authorization = accessHeader;
    }
  }

  return config;
});

axiosAPI.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    originalRequest.retriedTimes = (originalRequest.retriedTimes || 0) + 1;

    if (!error.response) {
      return Promise.reject(error);
    }

    // Prevent infinite loops
    if (
      error.response.status === 401 &&
      (originalRequest.url.includes("oauth/token/") ||
        originalRequest.retriedTimes >= 3)
    ) {
      // localStorage.removeItem("refresh_token");
      // localStorage.removeItem("access_token");
      // window.location.href = "/login/";
      return Promise.reject({ message: "Invalid session" });
    }

    if (
      error.response.status === 401 &&
      !originalRequest.url.includes("oauth") &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // curl -X POST -d "grant_type=refresh_token&client_id=<client_id>&client_secret=<client_secret>&refresh_token=<your_refresh_token>" http://localhost:8000/auth/token
          const response = await axiosAPI.post("oauth/token/", {
            grant_type: "refresh_token",
            client_id: process.env.AUTH_CLIENT_ID,
            client_secret: process.env.AUTH_CLIENT_SECRET,
            refresh_token: refreshToken,
          });
          setNewHeaders(response);
          const accessToken = response.data.access
          const accessHeader = accessToken ? "Bearer " + accessToken : null;
          originalRequest.headers["Authorization"] = accessHeader
          return axiosAPI(originalRequest);
        } catch (error) {
          return Promise.reject({reason: "Refresh token failed", message: "Please login to continue", title: "Your session has expired" });
        }
      } else {
        console.log("Refresh token not available.");
        return Promise.reject({message: "Refresh token not available." });
      }
    }

    // specific error handling done elsewhere
    return Promise.reject(error);
  }
);

export function setNewHeaders(data) {
  if (data.access) {
    axiosAPI.defaults.headers["Authorization"] = "JWT " + data.access;
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
  }
}

export default axiosAPI;
