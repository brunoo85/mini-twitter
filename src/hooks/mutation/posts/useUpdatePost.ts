/* eslint-disable @typescript-eslint/no-explicit-any */
import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdatePostArgs {
  id: number;
  data: object;
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: UpdatePostArgs) => postsService.update(id, data),
    mutationKey: ["updatePost"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status ?? error?.status;

      if (status === 403) {
        toast.error("Você não tem permissão para editar este post.");
      } else if (status === 404) {
        toast.error("Post não encontrado.");
      } else {
        toast.error("Erro ao atualizar o post. Tente novamente.");
      }
    },
  });
}
