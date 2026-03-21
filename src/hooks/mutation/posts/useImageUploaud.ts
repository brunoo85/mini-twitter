import { useRef, useState, type ChangeEvent } from "react";

interface UseImageUploadOptions {
  initialValue?: string;
  maxSizeMB?: number;
}

export function useImageUpload({
  initialValue = "",
  maxSizeMB = 5,
}: UseImageUploadOptions = {}) {
  const [imageValue, setImageValue] = useState<string>(initialValue);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialValue || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [showImageInput, setShowImageInput] = useState(!!initialValue);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setImageError(`A imagem deve ter no máximo ${maxSizeMB}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    setIsUploading(true);
    setImageError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setImageValue(base64String);
      setImagePreview(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setImageError("Erro ao ler o arquivo");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleUrlChange = (value: string) => {
    setImageValue(value);
    setImageError(null);

    if (!value) {
      setImagePreview(null);
      return;
    }

    if (isValidUrl(value)) {
      setImagePreview(value);
    } else {
      setImagePreview(null);
      setImageError("URL inválida");
    }
  };

  const handleRemove = () => {
    setImageValue("");
    setImagePreview(null);
    setShowImageInput(false);
    setImageError(null);
  };

  const reset = (value = "") => {
    setImageValue(value);
    setImagePreview(value || null);
    setShowImageInput(!!value);
    setImageError(null);
  };

  const resolvedImage: string | undefined = (() => {
    if (!imageValue) return undefined;
    if (imageValue.startsWith("data:image")) return imageValue;
    if (isValidUrl(imageValue)) return imageValue;
    return undefined;
  })();

  return {
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
    reset,
    resolvedImage,
    setImageError,
  };
}
