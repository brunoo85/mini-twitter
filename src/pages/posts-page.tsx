import { CustomEmpty } from "@/components/custom-empty";
import { CreatePostForm } from "@/components/posts-page/create-post-form";
import { PostCard } from "@/components/posts-page/post-card";
import { SearchBar } from "@/components/posts-page/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";
import { useGetPosts } from "@/hooks/query/posts/useGetPosts";
import { authService } from "@/services/auth.service";
import { Loader2, LogOut, MessageSquare } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetPosts({
    search: debouncedSearch,
  });
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isLoggedIn = !!localStorage.getItem("token-user");
  const posts = useMemo(() => data?.allPosts ?? [], [data]);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const handleLogOut = async () => {
    try {
      await authService.logout();
      logout();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao tentar fazer logout. Tente novamente.");
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b border-border bg-card">
          <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
            <h1 className="text-xl font-bold text-primary">Mini Twitter</h1>

            <div className="mx-8 max-w-md flex-1">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            {isLoggedIn ? (
              <Button
                onClick={handleLogOut}
                className="rotate-180 rounded-full w-9.25 h-9.25 hover:opacity-80"
              >
                <LogOut />{" "}
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate("/login?tab=login")}
                >
                  Login
                </Button>
                <Button onClick={() => navigate("/login?tab=cadastrar")}>
                  Cadastrar
                </Button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6">
          <div className="space-y-4">
            {isLoggedIn && <CreatePostForm />}

            {searchQuery && (
              <p className="text-sm text-muted-foreground">
                {posts?.length === 0
                  ? "Nenhum resultado encontrado"
                  : `${posts.length} ${posts.length === 1 ? "resultado" : "resultados"} para "${searchQuery}"`}
              </p>
            )}

            <div className="space-y-4">
              {posts?.length === 0 ? (
                <CustomEmpty
                  icon={<MessageSquare className="h-12 w-12" />}
                  title={
                    searchQuery ? "Nenhum post encontrado" : "Nenhum post ainda"
                  }
                  description={
                    searchQuery
                      ? "Tente buscar por outros termos"
                      : "Seja o primeiro a publicar algo!"
                  }
                />
              ) : (
                posts?.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    canInteract={isLoggedIn}
                  />
                ))
              )}
            </div>

            {!searchQuery.trim() && (
              <div ref={loadMoreRef} className="flex justify-center py-8">
                {isFetchingNextPage && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Carregando mais posts...</span>
                  </div>
                )}
              </div>
            )}

            {!searchQuery.trim() &&
              !hasNextPage &&
              (posts?.length ?? 0) > 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Você chegou ao fim do feed!
                </p>
              )}
          </div>
        </main>

        <footer className="border-t border-border bg-card py-4">
          <div className="mx-auto max-w-4xl px-4">
            <p className="text-sm font-semibold text-primary">Mini Twitter</p>
          </div>
        </footer>
      </div>
    </>
  );
}
