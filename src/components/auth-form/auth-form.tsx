import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { LoginTab } from "./login-tab";
import { RegisterTab } from "./register-tab";

export function AuthForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRegister, setShowPasswordRegister] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto h-120">
      <Tabs defaultValue="login" className="w-full h-full">
        <TabsList className="w-full bg-transparent p-0 h-auto rounded-none border-b border-border">
          <TabsTrigger
            value="login"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent text-muted-foreground pb-3 pt-2 font-medium data-[state=active]:shadow-none! "
          >
            Login
          </TabsTrigger>
          <TabsTrigger
            value="cadastrar"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-primary bg-transparent text-muted-foreground pb-3 pt-2 font-medium data-[state=active]:shadow-none!"
          >
            Cadastrar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="mt-8">
          <LoginTab
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </TabsContent>

        <TabsContent value="cadastrar" className="mt-8">
          <RegisterTab
            showPasswordRegister={showPasswordRegister}
            setShowPasswordRegister={setShowPasswordRegister}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
