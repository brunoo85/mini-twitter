import { useRef, useState } from "react";
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
import { useCreatePost } from "@/hooks/mutation/posts/useCreatePost";
import { useAuth } from "@/context/authContext";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../ui/field";
import { InputGroup, InputGroupAddon, InputGroupText } from "../ui/input-group";

const createPostSchema = z.object({
  title: z.string().min(3, "O título deve ter no mínimo 3 caracteres"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  image: z
    .string()
    .optional()
    .nullable()
    .refine(
      (img) => {
        if (!img) return true;
        if (img.startsWith("http")) {
          try {
            new URL(img);
            return true;
          } catch {
            return false;
          }
        }
        if (img.startsWith("data:image")) {
          const base64Size = new Blob([img]).size;
          return base64Size <= 7 * 1024 * 1024;
        }
        return false;
      },
      {
        message: "URL inválida ou imagem muito grande (máx 5MB)",
      },
    ),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const [showImageInput, setShowImageInput] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { mutate: createPost, isPending } = useCreatePost();
  const { currentUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      form.setError("image", {
        type: "manual",
        message: "A imagem deve ter no máximo 5MB",
      });
      return;
    }

    if (!file.type.startsWith("image/")) {
      form.setError("image", {
        type: "manual",
        message: "Por favor, selecione um arquivo de imagem válido",
      });
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      form.setValue("image", base64String);
      setImagePreview(base64String);
      setIsUploading(false);

      form.clearErrors("image");
    };
    reader.onerror = () => {
      form.setError("image", {
        type: "manual",
        message: "Erro ao ler o arquivo",
      });
      setIsUploading(false);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleRemoveImage = () => {
    form.setValue("image", "");
    setImagePreview(null);
    setShowImageInput(false);
  };

  const onSubmit = (data: CreatePostFormValues) => {
    createPost({
      title: data.title,
      content: data.content,
      image: data.image || undefined,
    });

    form.reset();
    setImagePreview(null);
    setShowImageInput(false);
  };

  const { isValid, isDirty } = form.formState;

  return (
    <Card className="border-primary/20 shadow-sm">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-2">
        <Avatar className="h-12 w-12 flex items-center justify-center">
          <AvatarFallback>
            {currentUser?.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </CardHeader>
      <CardContent>
        <form id="create-post-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-4">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-title">Título</FieldLabel>
                  <Input
                    {...field}
                    id="post-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Título do seu post"
                    className="font-medium"
                    maxLength={100}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="content"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="post-content">Conteúdo</FieldLabel>
                  <InputGroup>
                    <textarea
                      {...field}
                      id="post-content"
                      placeholder="O que você está pensando?"
                      rows={4}
                      className="w-full min-h-24 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-invalid={fieldState.invalid}
                      maxLength={500}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/500 caracteres
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Compartilhe seus pensamentos, ideias ou perguntas com a
                    comunidade.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {(showImageInput || imagePreview) && (
              <Controller
                name="image"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="post-image">Imagem</FieldLabel>

                    {imagePreview ? (
                      <div className="relative overflow-hidden rounded-lg border">
                        <img
                          src={imagePreview}
                          alt="Pré-visualização"
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    ) : (
                      <Input
                        {...field}
                        id="post-image"
                        value={field.value || ""}
                        onChange={field.onChange}
                        placeholder="Cole a URL da imagem ou faça upload"
                        type="url"
                        className="mb-2"
                      />
                    )}

                    <div className="flex gap-2 mt-2">
                      {!imagePreview && (
                        <>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                            id="image-upload"
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="gap-2"
                          >
                            <ImagePlus className="h-4 w-4" />
                            {isUploading ? "Carregando..." : "Upload da imagem"}
                          </Button>
                        </>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveImage}
                        disabled={isUploading}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                        Remover
                      </Button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            )}
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal" className="justify-between w-full">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(!showImageInput)}
            className="text-muted-foreground hover:text-primary"
            disabled={isUploading}
          >
            <ImagePlus className="mr-2 h-4 w-4" />
            {showImageInput ? "Ocultar imagem" : "Adicionar imagem"}
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={!isDirty || isUploading}
            >
              Limpar
            </Button>
            <Button
              type="submit"
              form="create-post-form"
              disabled={!isValid || !isDirty || isPending || isUploading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {isPending ? "Publicando..." : "Publicar"}
            </Button>
          </div>
        </Field>
      </CardFooter>
    </Card>
  );
}
