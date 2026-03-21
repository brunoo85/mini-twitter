import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface IBlueButton {
  type: "button" | "submit" | "reset";
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  form?: string;
}

export function BlueButton({
  type,
  children,
  disabled,
  className,
  form,
}: IBlueButton) {
  return (
    <Button
      form={form}
      disabled={disabled}
      type={type}
      className={cn(
        "w-full h-12 rounded-full border-none bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-base mt-6 shadow-lg shadow-primary/20",
        className,
      )}
    >
      {children}
    </Button>
  );
}
