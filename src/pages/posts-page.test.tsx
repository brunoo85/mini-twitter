import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PostsPage } from "./posts-page";
import { renderWithProviders } from "@/test/render-with-providers";

const useGetPostsMock = vi.fn();
const authLogoutMock = vi.fn();

vi.mock("@/hooks/query/posts/useGetPosts", () => ({
  useGetPosts: (...args: unknown[]) => useGetPostsMock(...args),
}));

vi.mock("@/context/authContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/authContext")>();
  return {
    ...actual,
    useAuth: () => ({ logout: authLogoutMock, currentUser: null }),
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("@/components/posts-page/create-post-form", () => ({
  CreatePostForm: () => <div>Criar post mockado</div>,
}));

vi.mock("@/components/posts-page/post-card", () => ({
  PostCard: ({ post }: { post: { title: string } }) => (
    <article>{post.title}</article>
  ),
}));

describe("PostsPage", () => {
  beforeEach(() => {
    useGetPostsMock.mockReturnValue({
      data: { allPosts: [] },
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    });
  });

  it("mostra form de criação quando usuário está logado", () => {
    localStorage.setItem("token-user", "token");
    renderWithProviders(<PostsPage />);

    expect(screen.getByText("Criar post mockado")).toBeInTheDocument();
  });

  it("não mostra form de criação quando usuário não está logado", () => {
    renderWithProviders(<PostsPage />);

    expect(screen.queryByText("Criar post mockado")).not.toBeInTheDocument();
  });
});
