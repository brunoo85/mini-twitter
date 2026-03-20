import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePost } from "@/hooks/mutation/posts/useDeletePost";
import { useModal } from "@/hooks/use-auth-modal";

export function DeletePostModal() {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "deletePost";

  const { mutateAsync: deletePost } = useDeletePost();
  const post = data?.post;
  if (!post) return null;
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir post</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir este post? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button>Cancelar</Button>
          <Button
            onClick={() => deletePost(post.id)}
            className="bg-destructive text-card hover:bg-destructive/90"
          >
            Excluir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
