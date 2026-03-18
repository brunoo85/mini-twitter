import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useToogleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsService.like(id),
    mutationKey: ["likePost"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
