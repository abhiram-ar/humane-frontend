import { store } from "@/app/store/store";
import { setCredentials } from "@/features/userAuth/redux/userAuthSlice";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

export const api: AxiosInstance = axios.create({
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
        const { data } = await axios.get<{ data: { token: string } }>(
          "http://localhost/api/v1/user/auth/refresh",
        );

        const newToken = data.data.token;
        store.dispatch(setCredentials({ token: newToken }));
        processQueue(null, newToken);

        // retry the original request
        if (originalReq.headers) {
          originalReq.headers["Authorization"] = `Bearer ${newToken}`;
        }
        return api(originalReq);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
      } finally {
        isRefreshing = false;
      }
    }

    // if not 401 or alredy rejected, just passtrough
    return Promise.reject(error);
  },
);

