import { postsService } from "@/services/posts.service";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";

export function useGetPosts(params?: { search?: string }) {
  return useInfiniteQuery({
    queryKey: ["posts", params],
    queryFn: ({ pageParam = 1 }) =>
      postsService.getAll({ ...params, page: pageParam }),

    initialPageParam: 1,

    select: (data) => ({
      allPosts: data.pages.flatMap((page) => page.data.posts),
      pageParams: data.pageParams,
    }),

    getNextPageParam: (lastPage) => {
      const { page, limit, total } = lastPage.data;

      const totalPages = Math.ceil(total / limit);

      return page < totalPages ? page + 1 : undefined;
    },

    placeholderData: keepPreviousData,
  });
}
