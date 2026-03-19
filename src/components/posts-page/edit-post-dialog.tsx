import { useState, useEffect } from "react";
import { ImagePlus, X } from "lucide-react";
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
import type { Post } from "@/lib/types";
import { useUpdatePost } from "@/hooks/mutation/posts/useUpdatePost";

interface EditPostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPostDialog({
  post,
  open,
  onOpenChange,
}: EditPostDialogProps) {
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.image || "");

  const { mutateAsync: updatePost } = useUpdatePost();

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(post.title);
      setContent(post.content);
      setImageUrl(post.image || "");
    }
  }, [open, post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const trimmedImageUrl = String(imageUrl).trim();
    updatePost({
      id: post.id,
      data: {
        title: title.trim(),
        content: content.trim(),
        image: trimmedImageUrl ? new URL(trimmedImageUrl) : undefined,
      },
    });
    onOpenChange(false);
  };

  // const isValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          <Field>
            <FieldLabel htmlFor="edit-image">
              URL da imagem (opcional)
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                id="edit-image"
                value={
                  typeof imageUrl === "string" ? imageUrl : imageUrl.toString()
                }
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                type="url"
              />
              {imageUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setImageUrl("")}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover imagem</span>
                </Button>
              )}
            </div>
          </Field>

          {imageUrl && (
            <div className="relative overflow-hidden rounded-lg border">
              <img
                src={
                  typeof imageUrl === "string" ? imageUrl : imageUrl.toString()
                }
                alt="Pré-visualização"
                className="w-full h-32 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <ImagePlus className="mr-2 h-4 w-4" />
              Salvar alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
