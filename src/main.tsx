import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { PostsProvider } from "./context/postContext.tsx";
import { AuthProvider } from "./context/authContext.tsx";

const queryClient = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <PostsProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </PostsProvider>
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
