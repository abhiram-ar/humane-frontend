import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./app/store/store";
import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/reactQuery";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ScrollRestorationProvider } from "./app/providers/ScrollRestoreationProvider";
import ChatSocketProvider from "./app/providers/ChatSocketProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Toaster
          toastOptions={{
            style: { backgroundColor: "#464646", color: "white" },
            duration: 3 * 1000,
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
        <ScrollRestorationProvider>
          <ChatSocketProvider>
            <RouterProvider router={router} />
          </ChatSocketProvider>
        </ScrollRestorationProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);
