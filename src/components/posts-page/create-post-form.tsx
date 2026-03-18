import { useState } from "react";
import { ImagePlus, Send, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/context/postContext";

export function CreatePostForm() {
  const { currentUser, addPost } = usePosts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [showImageInput, setShowImageInput] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    addPost({
      title: title.trim(),
      content: content.trim(),
      image: imageUrl.trim() ? new URL(imageUrl.trim()) : undefined,
      likesCount: 0,
    });

    setTitle("");
    setContent("");
    setImageUrl("");
    setShowImageInput(false);
  };

  const isValid = title.trim().length > 0 && content.trim().length > 0;
  console.log({ currentUser });
  return (
    <Card className="border-primary/20 shadow-sm">
      <form onSubmit={handleSubmit}>
        <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
          <Avatar className="h-12 w-12 flex items-center justify-center">
            <AvatarFallback>
              {currentUser?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do seu post"
              className="font-medium"
              maxLength={100}
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="O que você está pensando?"
              className="min-h-20 resize-none"
              maxLength={500}
            />
          </div>
        </CardHeader>

        {showImageInput && (
          <CardContent className="pt-0">
            <div className="ml-16 space-y-3">
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Cole a URL da imagem"
                  type="url"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setImageUrl("");
                    setShowImageInput(false);
                  }}
                  className="shrink-0"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remover</span>
                </Button>
              </div>
              {imageUrl && (
                <div className="relative overflow-hidden rounded-lg border">
                  <img
                    src={imageUrl}
                    alt="Pré-visualização"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </CardContent>
        )}

        <CardFooter className="justify-between border-t pt-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
            className="text-muted-foreground hover:text-primary"
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            Adicionar imagem
          </Button>
          <Button type="submit" disabled={!isValid} className="gap-2">
            <Send className="h-4 w-4" />
            Publicar
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
