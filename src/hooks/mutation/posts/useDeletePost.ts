import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsService.delete(id),
    mutationKey: ["deletePost"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
