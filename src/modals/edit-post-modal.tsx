import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { useUpdatePost } from "@/hooks/mutation/posts/useUpdatePost";
import { useModal } from "@/hooks/use-auth-modal";
import { ImageUploadField } from "@/components/posts-page/image-upload-field";
import { useImageUpload } from "@/hooks/mutation/posts/useImageUploaud";

export function EditPostModal() {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "editPost";
  const post = data?.post;

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");

  const upload = useImageUpload();

  const { mutateAsync: updatePost } = useUpdatePost();

  if (!post) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      await updatePost({
        id: post.id,
        data: {
          title: title.trim(),
          content: content.trim(),
          image: upload.resolvedImage,
        },
      });
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="edit-title">Título</FieldLabel>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do post"
              maxLength={100}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="edit-content">Conteúdo</FieldLabel>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você está pensando?"
              rows={4}
              maxLength={500}
            />
          </Field>

          <ImageUploadField upload={upload} />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || upload.isUploading}
            >
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
