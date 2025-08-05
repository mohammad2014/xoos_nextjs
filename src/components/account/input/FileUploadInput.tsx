"use client";

import { Button } from "@/components/ui/button";
import { Loader2, PaperclipIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { uploadAttachment } from "@/lib/api";
import Image from "next/image";
import { ImageTs } from "@/types/imageTs";
import { useDictionary } from "@/hooks/use-dictionary";

interface FileUploadProps {
  accept?: string;
  disabled?: boolean;
  onUploadSuccess?: (image: ImageTs | null) => void;
  error?: string;
  defaultImageUrl?: string;
  defaultImageName?: string;
}

export default function FileUploadInput({
  accept = "image/*,video/*",
  disabled,
  onUploadSuccess,
  error,
  defaultImageUrl,
  defaultImageName,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dictionary } = useDictionary();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (!file) {
      onUploadSuccess?.(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error(dictionary.ui.form.maxSizeError);
      resetFile();
      return;
    }

    const validTypes = ["image/", "video/"];
    if (!validTypes.some((type) => file.type.startsWith(type))) {
      toast.error(dictionary.ui.form.invalidFileType);
      resetFile();
      return;
    }

    // Upload
    setIsUploading(true);
    try {
      const result = await uploadAttachment(file, "");
      if (result?.status === "success") {
        toast.success(result.message);
        onUploadSuccess?.(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(dictionary.common.error);
      resetFile();
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetFile = () => {
    setSelectedFile(null);
    onUploadSuccess?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const imageSrc = selectedFile
    ? URL.createObjectURL(selectedFile)
    : defaultImageUrl || null;

  return (
    <div className="space-y-2">
      <div
        className={`border-2 border-dashed rounded-lg p-4 ${
          error ? "border-red-300" : "border-gray-300"
        }`}
      >
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            {dictionary.ui.form.fileGuideline}
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="mb-3"
          >
            {isUploading ? (
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
            ) : (
              <PaperclipIcon className="h-4 w-4 mr-2" />
            )}
            {selectedFile || defaultImageUrl
              ? dictionary.ui.form.changeFile
              : dictionary.ui.form.selectFile}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </div>

        {(selectedFile || defaultImageUrl) && imageSrc && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedFile?.type.startsWith("video/") ||
              defaultImageUrl?.endsWith(".mp4") ? (
                <video
                  src={imageSrc}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <div className="relative w-14 h-14">
                  <Image
                    src={imageSrc}
                    alt="Preview"
                    fill
                    className="object-cover rounded"
                  />
                </div>
              )}
              <div>
                {selectedFile ? (
                  <>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                ) : (
                  <p className="text-sm font-medium">{defaultImageName}</p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFile}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
