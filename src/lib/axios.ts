import { store } from "@/app/store/store";
import { setCredentials } from "@/features/userAuth/redux/userAuthSlice";
import { JWTAuthPayload } from "@/types/JWTAuthPayload";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
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

api.interceptors.request.use(
  (config) => {
    const token = store.getState().userAuth.token;
    // Add Authorization only if token exist
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

api.interceptors.response.use(
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
              resolve(api(originalReq));
            },
            onError: reject,
          });
        });
      }

      // other wise flag current resqust is refreshing
      isRefreshing = true;
      try {
        console.log("query failed, refreshing accessToken");
        const { data } = await axios.get<{ data: { token: string } }>(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/global/auth/refresh`,
          { withCredentials: true },
        );

        const newToken = data.data.token;
        const decoded = jwtDecode<JWTAuthPayload>(newToken);

        if (decoded.type !== "user") {
          throw new Error("API refresh error, get a non user accessToken after refresh");
        }

        store.dispatch(setCredentials({ token: newToken }));
        processQueue(null, newToken);

        // retry the original request
        if (originalReq.headers) {
          originalReq.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        console.log("error refrehing token", refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // if not 401 or alredy rejected, just passtrough
    return Promise.reject(error);
  },
);
