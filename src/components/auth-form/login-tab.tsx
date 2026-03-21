import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FooterFormAuth } from "./footer-form-auth";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { useAuth } from "@/context/authContext";

interface ILoginTabProps {
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
}

const loginSchema = z.object({
  email: z.email({ error: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { error: "A senha deve conter no mínimo 6 caracteres" }),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginTab({ showPassword, setShowPassword }: ILoginTabProps) {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data);
      localStorage.setItem("token-user", response.data.token);
      setCurrentUser(response.data.user);
      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? "E-mail ou senha inválidos");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary font-['Roboto']">
          Olá, de novo!
        </h2>
        <p className="text-muted-foreground mt-1">
          Por favor, insira os seus dados para fazer login.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">E-mail</label>
          <div className="relative">
            <input
              {...register("email")}
              type="email"
              placeholder="Insira o seu e-mail"
              className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">
              {typeof errors.email.message === "string"
                ? errors.email.message
                : "E-mail inválido"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Senha</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Insira a sua senha"
              className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors [&::-webkit-inner-spin-button]:appearance-none no-reveal-icon"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">
              {typeof errors.password.message === "string"
                ? errors.password.message
                : "Senha inválida"}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 rounded-full border-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base mt-6 shadow-lg shadow-primary/20"
        >
          Continuar
        </Button>
      </form>

      <FooterFormAuth />
    </div>
  );
}
