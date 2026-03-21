import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostDto {
  title: string;
  content: string;
  image?: string | URL;
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostDto) => postsService.create(data),
    mutationKey: ["createPost"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
