import { AuthForm } from "./components/auth-form";
import { ThemeToggle } from "./components/theme-toggle";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="absolute top-4 right-4">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md space-y-10">
          <h1
            className="text-4xl md:text-5xl font-bold  text-primary text-center"
            style={{ fontFamily: "Roboto, sans-serif" }}
          >
            Mini Twitter
          </h1>

          <AuthForm />
        </div>
      </main>
    </TooltipProvider>
  );
}

export default App;
