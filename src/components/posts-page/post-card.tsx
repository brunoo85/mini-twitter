import { Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useModal } from "@/hooks/use-auth-modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuth } from "@/context/authContext";
import { useToogleLike } from "@/hooks/mutation/posts/useToogleLike";

interface PostCardProps {
  post: Post;
  canInteract: boolean;
}

export function PostCard({ post, canInteract }: PostCardProps) {
  const { currentUser } = useAuth();
  const { mutateAsync: toggleLike } = useToogleLike();
  const isAuthor = post.authorId === currentUser?.id;
  const { onOpen } = useModal();

  const handleLike = () => {
    if (canInteract) {
      toggleLike(post.id);
    } else {
      onOpen("auth");
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-border shadow-sm transition-shadow hover:shadow-md">
        <div className="p-4">
          <CardHeader className="mb-3 flex items-start justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="font-semibold text-card-foreground">
                {post.authorName}
              </span>
              <span className="text-sm ">
                @{post.authorName.toLowerCase().replace(/\s/g, "")}
              </span>
              <span className="">·</span>
              <span className="text-sm">
                {format(post.createdAt, "P", { locale: ptBR })}
              </span>
            </div>
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 rounded-full"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Mais opções</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => onOpen("editPost", { post })}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onOpen("deletePost", { post })}
                    variant="destructive"
                    className="text-destructive! focus:bg-destructive/10! focus:text-destructive!"
                  >
                    <Trash2 className="mr-2 h-4 w-4 transition-colors" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <h3 className="font-semibold text-lg text-card-foreground">
              {post.title}
            </h3>
            <p className="text-card-foreground/90 leading-relaxed">
              {post.content}
            </p>
            {post.image && (
              <div className="mt-3 relative overflow-hidden rounded-xl">
                <img
                  src={post.image.toString()}
                  alt="Imagem do post"
                  className="w-full h-auto max-h-96 object-cover"
                />
              </div>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={cn(
                "p-0 rounded-full  transition-colors hover:bg-like/10",
                post.likesCount > 0 && "text-like hover:text-like/80",
              )}
            >
              <Heart
                className={cn(
                  "h-5 w-5 transition-all stroke-red-500",
                  post.likesCount > 0 && "fill-red-500 scale-110",
                )}
                strokeWidth={1}
                size={50}
              />
            </Button>
          </CardContent>
        </div>
      </Card>
    </>
  );
}
