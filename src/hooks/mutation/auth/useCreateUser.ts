import { authService } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
  const mutation = useMutation({
    mutationFn: authService.register,
    mutationKey: ["registerUser"],
  });

  return mutation;
}
