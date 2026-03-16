import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Eye, EyeOff, User } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto h-120">
      <Tabs defaultValue="login" className="w-full h-full">
        <TabsList className="w-full bg-transparent p-0 h-auto rounded-none border-b border-border font-['Roboto']">
          <TabsTrigger
            value="login"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent text-muted-foreground pb-3 pt-2 font-medium data-[state=active]:shadow-none "
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="cadastrar"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent text-muted-foreground pb-3 pt-2 font-medium data-[state=active]:shadow-none"
          >
            Cadastrar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">Olá, de novo!</h2>
              <p className="text-muted-foreground mt-1">
                Por favor, insira os seus dados para fazer login.
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Insira o seu e-mail"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Insira a sua senha"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base mt-6"
              >
                Continuar
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Ao clicar em continuar, você concorda com nossos{" "}
              <a href="#" className="underline hover:text-foreground">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="underline hover:text-foreground">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </TabsContent>

        <TabsContent value="cadastrar" className="mt-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Olá, vamos começar!
              </h2>
              <p className="text-muted-foreground mt-1">
                Por favor, insira os dados solicitados para fazer cadastro.
              </p>
            </div>

            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nome
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Insira o seu nome"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  E-mail
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Insira o seu e-mail"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPasswordRegister ? "text" : "password"}
                    placeholder="Insira a sua senha"
                    className="w-full h-12 px-4 pr-12 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswordRegister(!showPasswordRegister)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPasswordRegister ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base mt-6"
              >
                Continuar
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Ao clicar em continuar, você concorda com nossos{" "}
              <a href="#" className="underline hover:text-foreground">
                Termos de Serviço
              </a>{" "}
              e{" "}
              <a href="#" className="underline hover:text-foreground">
                Política de Privacidade
              </a>
              .
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
