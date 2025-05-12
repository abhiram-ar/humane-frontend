import { store } from "@/app/store/store";
import { setAdminCredentials } from "@/features/admin/redux/adminAuthSlice";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

export const adminApi: AxiosInstance = axios.create({
  baseURL: "http://localhost",
  withCredentials: true,
  timeout: 10000, //10s
});

type QueueEntry = {
  onSuccess: (token: string) => void;
  onError: (err: AxiosError) => void;
};

let isRefreshing = false;
let requestQueue: QueueEntry[] = [];

function processQueue(error: AxiosError | null, token?: string) {
  requestQueue.forEach(({ onSuccess, onError }) => {
    if (error) {
      onError(error);
    } else if (token) {
      onSuccess(token);
    }
  });
  requestQueue = [];
}

adminApi.interceptors.request.use(
  (config) => {
    const token = store.getState().adminAuth.token;
    // Add Authorization only if token exist
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

adminApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalReq = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true;

      // if another request is in progress queue the request
      // so we can avoid cascading/multiple refresh call
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          requestQueue.push({
            onSuccess: (token: string) => {
              if (!originalReq.headers) return;
              originalReq.headers["Authorization"] = `Bearer ${token}`;
              resolve(adminApi(originalReq));
            },
            onError: reject,
          });
        });
      }

      // other wise flag current resqust is refreshing
      isRefreshing = true;
      try {
        const { data } = await axios.get<{ data: { token: string } }>(
          "http://localhost/api/v1/global/auth/refresh",
          { withCredentials: true },
        );

        const newToken = data.data.token;
        const decoded = jwtDecode<JWTAuthPayload>(newToken);

        if (decoded.type !== "admin") {
          throw new Error("API refresh error, get a non admin accessToken after refresh");
        }

        store.dispatch(setAdminCredentials({ token: newToken }));
        processQueue(null, newToken);

        // retry the original request
        if (originalReq.headers) {
          originalReq.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return adminApi(originalReq);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError) {
          processQueue(refreshError as AxiosError);
        } else {
          console.log("error while refreshing admin API accessToken", error);
        }
      } finally {
        isRefreshing = false;
      }
    }

    // if not 401 or alredy rejected, just passtrough
    return Promise.reject(error);
  },
);
