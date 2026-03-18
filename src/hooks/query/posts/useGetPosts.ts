import { postsService } from "@/services/posts.service";
import { useQuery } from "@tanstack/react-query";

export function useGetPosts(params?: { search?: string; page?: number }) {
  const query = useQuery({
    queryKey: ["posts", params],
    queryFn: () => postsService.getAll(params),
    select: (response) => response.data,
  });

  return query;
}
