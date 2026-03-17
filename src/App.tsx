import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { Route, Routes } from "react-router-dom";
import { AuthPage } from "./pages/auth-page";
import { PostsPage } from "./pages/posts-page";

function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="posts" element={<PostsPage />} />
      </Routes>
    </TooltipProvider>
  );
}

export default App;
