import { CssBaseline } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
export const queryClient = new QueryClient();

root.render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
