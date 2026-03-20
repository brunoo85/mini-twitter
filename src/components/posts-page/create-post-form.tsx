import { useRef, useState, type ChangeEvent } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreatePost } from "@/hooks/mutation/posts/useCreatePost";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const createPostSchema = z.object({
  rawText: z.string().min(5, "O post está muito curto"),
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      rawText: "",
      image: "",
    },
  });

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    editorProps: {
      attributes: {
        class:
          "prose prose-sm focus:outline-none max-w-none min-h-[64px] text-base placeholder:text-muted-foreground post-editor",
      },
    },
    onUpdate: ({ editor }) => {
      form.setValue("rawText", editor.getText(), { shouldValidate: true });
    },
  });

  const handleImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
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
    const fullText = editor?.getText() || "";
    const lines = fullText.split("\n").filter((line) => line.trim() !== "");

    const title = lines[0].trim() || "Sem título";
    const content = lines.slice(1).join("\n").trim() || title;

    createPost({
      title,
      content,
      image: data.image || undefined,
    });

    form.reset();
    editor?.commands.clearContent();
    setImagePreview(null);
    setShowImageInput(false);
  };

  const { isValid } = form.formState;

  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <form id="create-post-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="space-y-3 p-4">
          <div className="relative">
            {!editor?.getText() && (
              <span className="absolute pointer-events-none text-muted-foreground opacity-50">
                E aí, o que está rolando?
              </span>
            )}
            <EditorContent editor={editor} />
          </div>

          {(showImageInput || imagePreview) && (
            <div className="space-y-3 pt-2">
              <div className="flex gap-2">
                <Controller
                  name="image"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
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
                          // id="post-image"
                          value={field.value || ""}
                          onChange={field.onChange}
                          placeholder="Cole a URL da imagem ou faça upload"
                          type="url"
                          className="flex-1"
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
                              {isUploading
                                ? "Carregando..."
                                : "Upload da imagem"}
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
              </div>
            </div>
          )}
        </FieldGroup>
      </form>

      <Field orientation="horizontal" className="justify-between w-full px-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowImageInput(!showImageInput)}
          className="text-muted-foreground hover:text-primary rounded-full w-6 h-6"
          disabled={isUploading}
        >
          <ImagePlus className="" size={20} />
          {/* {showImageInput ? "Ocultar imagem" : "Adicionar imagem"} */}
        </Button>

        <div className="flex gap-2">
          <Button
            type="submit"
            form="create-post-form"
            disabled={!isValid || isPending || isUploading}
            className="gap-2 rounded-full hover:opacity-80 cursor-pointer"
          >
            {isPending ? "Postando" : "Postar"}
          </Button>
        </div>
      </Field>
    </Card>
  );
}
