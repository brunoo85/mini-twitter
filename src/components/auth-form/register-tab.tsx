import { Eye, EyeOff, Mail, User } from "lucide-react";
import { Button } from "../ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FooterFormAuth } from "./footer-form-auth";
import { useCreateUser } from "@/hooks/mutation/auth/useCreateUser";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface IRegisterTabProps {
  showPasswordRegister: boolean;
  setShowPasswordRegister: (value: boolean) => void;
}

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { error: "O nome deve conter no mínimo 2 caracteres" }),
  email: z.string().email({ error: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { error: "A senha deve conter no mínimo 6 caracteres" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterTab({
  showPasswordRegister,
  setShowPasswordRegister,
}: IRegisterTabProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const navigate = useNavigate();

  const { mutateAsync: registerUser } = useCreateUser();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data);
      navigate("/posts");
    } catch (error: any) {
      if (error.response?.status === 400) {
        const backendMessage = error.response.data.message;

        if (backendMessage.includes("email")) {
          setError("email", {
            type: "manual",
            message: "Este email já está sendo utilizado.",
          });
        } else {
          toast.error(backendMessage);
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary">Olá, vamos começar!</h2>
        <p className="text-muted-foreground mt-1">
          Por favor, insira os dados solicitados para fazer cadastro.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nome</label>
          <div className="relative">
            <input
              {...register("name")}
              type="text"
              placeholder="Insira o seu nome"
              className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          {errors.name && (
            <p className="text-red-500 text-sm">
              {typeof errors.name.message === "string"
                ? errors.name.message
                : "Nome inválido"}
            </p>
          )}
        </div>

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
              type={showPasswordRegister ? "text" : "password"}
              placeholder="Insira a sua senha"
              className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPasswordRegister(!showPasswordRegister)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPasswordRegister ? (
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
