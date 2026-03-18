import "./index.css";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/auth-page";
import { PostsPage } from "./pages/posts-page";
import { Toaster } from "./components/ui/sonner";
import { ModalProvider } from "./modals/modalProvider";

function App() {
  return (
    <>
      <ModalProvider />
      <Toaster richColors />
      <Routes>
        <Route path="/" element={<PostsPage />} />
        <Route path="/login" element={<AuthPage />} />
      </Routes>
    </>
  );
}

export default App;
