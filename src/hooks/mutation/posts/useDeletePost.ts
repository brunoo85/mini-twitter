/* eslint-disable @typescript-eslint/no-explicit-any */
import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsService.delete(id),
    mutationKey: ["deletePost"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: any) => {
      const status = error?.response?.status ?? error?.status;
      if (status === 403) {
        toast.error("Você não tem permissão para excluir este post.");
      } else if (status === 404) {
        toast.error("Post não encontrado.");
      } else {
        toast.error("Erro ao excluir o post. Tente novamente.");
      }
    },
  });
}
