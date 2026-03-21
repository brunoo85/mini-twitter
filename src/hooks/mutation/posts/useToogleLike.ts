import type { Post } from "@/lib/types";
import { postsService } from "@/services/posts.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type PostsCache = {
  pages: Array<{
    data: {
      posts: Post[];
      page: number;
      limit: number;
      total: number;
    };
  }>;
  pageParams: unknown[];
};

export function useToogleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postsService.like(id),
    mutationKey: ["likePost"],
    onMutate: async (postId: number) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });
      const previousCaches = queryClient.getQueriesData<PostsCache>({
        queryKey: ["posts"],
      });
      queryClient.setQueriesData<PostsCache>(
        { queryKey: ["posts"] },
        (cache) => {
          if (!cache) return cache;

          return {
            ...cache,
            pages: cache.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((post) => {
                  if (post.id !== postId) return post;
                  return {
                    ...post,
                    likesCount: post.likesCount > 0 ? 0 : 1,
                  };
                }),
              },
            })),
          };
        },
      );

      return { previousCaches };
    },
    onError: (_error, _postId, context) => {
      context?.previousCaches.forEach(([queryKey, previousCache]) => {
        queryClient.setQueryData(queryKey, previousCache);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
