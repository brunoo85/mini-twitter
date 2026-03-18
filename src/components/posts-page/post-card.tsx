import { useState } from "react";
import { Heart, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Post } from "@/lib/types";
import { cn } from "@/lib/utils";
import { usePosts } from "@/context/postContext";
import { EditPostDialog } from "./edit-post-dialog";
import { useModal } from "@/hooks/use-auth-modal";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PostCardProps {
  post: Post;
  canInteract: boolean;
}

export function PostCard({ post, canInteract }: PostCardProps) {
  const { currentUser, toggleLike, deletePost } = usePosts();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const isAuthor = post.authorId === currentUser.id;
  const { onOpen } = useModal();

  const handleLike = () => {
    if (canInteract) {
      toggleLike(post.id);
    } else {
      console.log("onClick apertado");
      onOpen("auth");
    }
  };

  return (
    <>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
          <Avatar className="h-12 w-12">
            <AvatarFallback>
              {post.authorName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="font-semibold text-card-foreground truncate">
                  {post.authorName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(post.createdAt, "Pp", { locale: ptBR })}
                </p>
              </div>
              {isAuthor && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Mais opções</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setShowDeleteDialog(true)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <h3 className="font-semibold text-lg text-card-foreground">
            {post.title}
          </h3>
          <p className="text-card-foreground/90 leading-relaxed">
            {post.content}
          </p>
          {post.image && (
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={post.image.toString()}
                alt="Imagem do post"
                className="w-full h-auto max-h-96 object-cover"
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={cn(
              "gap-2 transition-colors",
              post.likedByUser && "text-like hover:text-like/80",
            )}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all",
                post.likedByUser && "fill-current scale-110",
              )}
            />
            <span className="font-medium">{post.likesCount}</span>
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este post? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePost(post.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditPostDialog
        post={post}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  );
}
