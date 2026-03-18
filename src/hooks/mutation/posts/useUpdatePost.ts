import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    onError: (error) => {
      console.error("Erro ao atualizar post:", error);
    },
  });
}
