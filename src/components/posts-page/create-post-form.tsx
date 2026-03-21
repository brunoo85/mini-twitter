import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCreatePost } from "@/hooks/mutation/posts/useCreatePost";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Field, FieldGroup } from "../ui/field";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BlueButton } from "../blue-button";
import { useImageUpload } from "@/hooks/mutation/posts/useImageUploaud";
import { ImageUploadField } from "./image-upload-field";
import { getPostPayloadFromText } from "./create-post.utils";

const createPostSchema = z.object({
  rawText: z.string().min(5, "O post está muito curto"),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

export function CreatePostForm() {
  const { mutate: createPost, isPending } = useCreatePost();

  const upload = useImageUpload();

  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: { rawText: "" },
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

  const onSubmit = () => {
    const fullText = editor?.getText() || "";
    const { title, content } = getPostPayloadFromText(fullText);

    createPost({
      title,
      content,
      image: upload.resolvedImage,
    });

    form.reset();
    editor?.commands.clearContent();
    upload.reset();
  };

  const { isValid } = form.formState;

  return (
    <Card className="overflow-hidden border-border shadow-xl">
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

          {(upload.showImageInput || upload.imagePreview) && (
            <ImageUploadField upload={upload} />
          )}
        </FieldGroup>
      </form>

      <Field orientation="horizontal" className="justify-between w-full px-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => upload.setShowImageInput(!upload.showImageInput)}
          className="text-muted-foreground hover:text-primary rounded-full w-6 h-6"
          disabled={upload.isUploading}
        >
          <ImagePlus size={20} />
        </Button>

        <BlueButton
          type="submit"
          form="create-post-form"
          disabled={!isValid || isPending || upload.isUploading}
          className="gap-2 rounded-full hover:opacity-80 cursor-pointer text-[14px] w-25 h-10 px-5"
        >
          {isPending ? "Postando" : "Postar"}
        </BlueButton>
      </Field>
    </Card>
  );
}
