import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import type { useImageUpload } from "@/hooks/mutation/posts/useImageUploaud";

interface ImageUploadFieldProps {
  upload: ReturnType<typeof useImageUpload>;
  label?: string;
}

export function ImageUploadField({
  upload,
  label = "Imagem (opcional)",
}: ImageUploadFieldProps) {
  const {
    imageValue,
    imagePreview,
    isUploading,
    imageError,
    showImageInput,
    setShowImageInput,
    fileInputRef,
    handleFileSelect,
    handleUrlChange,
    handleRemove,
  } = upload;

  return (
    <Field>
      <div className="flex items-center justify-between">
        <FieldLabel>{label}</FieldLabel>
        {!showImageInput && !imagePreview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowImageInput(true)}
            className="text-muted-foreground hover:text-primary gap-1"
            disabled={isUploading}
          >
            <ImagePlus className="h-4 w-4" />
            Adicionar imagem
          </Button>
        )}
      </div>

      {(showImageInput || imagePreview) && (
        <div className="space-y-3">
          {imagePreview ? (
            <div className="relative overflow-hidden rounded-lg border">
              <img
                src={imagePreview}
                alt="Pré-visualização"
                className="w-full h-40 object-cover"
                onError={() => {
                  upload.setImageError("Não foi possível carregar a imagem");
                }}
              />
            </div>
          ) : (
            <Input
              value={imageValue}
              onChange={(e) => handleUrlChange(e.target.value)}
              placeholder="Cole a URL da imagem ou faça upload"
              type="url"
            />
          )}

          <div className="flex gap-2">
            {!imagePreview && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
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
              onClick={handleRemove}
              disabled={isUploading}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
              Remover
            </Button>
          </div>

          {imageError && <FieldError errors={[{ message: imageError }]} />}
        </div>
      )}
    </Field>
  );
}
