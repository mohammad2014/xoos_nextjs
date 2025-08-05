"use client";
import { Button } from "@/components/ui/button";
import { Loader2, PaperclipIcon, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { toast } from "sonner";
import { uploadAttachment } from "@/lib/api";
import Image from "next/image";
import { ImageTs } from "@/types/imageTs";
import { useDictionary } from "@/hooks/use-dictionary";

interface FileUploadProps {
  accept?: string;
  disabled?: boolean;
  multiple?: boolean;
  onUploadSuccess?: (images: ImageTs[] | ImageTs | null) => void;
  onFilesChange?: (files: File[] | null) => void;
  error?: string;
  defaultImages?: ImageTs[];
  onDefaultRemove?: (id: number) => void;
}

export default function FileUploadInput({
  accept = "image/*,video/*",
  disabled,
  multiple = false,
  onUploadSuccess,
  onFilesChange,
  error,
  defaultImages = [],
  onDefaultRemove,
}: FileUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentDefaultImages, setCurrentDefaultImages] =
    useState<ImageTs[]>(defaultImages);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { dictionary } = useDictionary();

  // همگام‌سازی اولیه currentDefaultImages با defaultImages
  useEffect(() => {
    if (defaultImages.length > 0 && currentDefaultImages.length === 0) {
      setCurrentDefaultImages(defaultImages);
    }
  }, [defaultImages, currentDefaultImages]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    onFilesChange?.(files.length ? files : null);

    if (!files.length) {
      onUploadSuccess?.(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // فقط اولین فایل انتخاب‌شده رو پردازش می‌کنیم
    const file = files[0];

    // اطلاع‌رسانی اگر چند فایل انتخاب شده
    if (files.length > 1 && multiple) {
      toast.info("فقط اولین فایل انتخاب‌شده آپلود خواهد شد.");
    }

    // اعتبارسنجی فایل
    const validTypes = ["image/", "video/"];
    if (file.size > 15 * 1024 * 1024) {
      toast.error(dictionary.ui.form.maxSizeError);
      resetFiles();
      return;
    }
    if (!validTypes.some((type) => file.type.startsWith(type))) {
      toast.error(dictionary.ui.form.invalidFileType);
      resetFiles();
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadAttachment(file, "");
      if (result?.status === "success") {
        console.log(result);

        toast.success(result.message);
        onUploadSuccess?.(multiple ? [result.data] : result.data);
        setCurrentDefaultImages((prev) => [...prev, result.data]);
        resetFiles(); // ریست کردن فایل‌های انتخاب‌شده بعد از آپلود
      } else {
        toast.error(result.message);
        resetFiles();
      }
    } catch (error) {
      toast.error(dictionary.common.error);
      resetFiles();
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const resetFiles = () => {
    setSelectedFiles([]);
    onFilesChange?.(null);
    onUploadSuccess?.(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFilesChange?.(newFiles.length ? newFiles : null);
  };

  const handleDefaultRemove = (id: number) => {
    console.log("Removing image with id:", id); // برای دیباگ
    console.log("Before remove, currentDefaultImages:", currentDefaultImages);
    setCurrentDefaultImages((prev) => {
      const newImages = prev.filter((img) => img.id !== id);
      console.log("After remove, newImages:", newImages);
      return newImages;
    });
    onDefaultRemove?.(id);
  };

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
            {selectedFiles.length || currentDefaultImages.length
              ? dictionary.ui.form.changeFile
              : dictionary.ui.form.selectFile}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
          />
        </div>
        {(selectedFiles.length > 0 || currentDefaultImages.length > 0) && (
          <div className="mt-4 space-y-2">
            {/* Render selected files */}
            {selectedFiles.map((file, index) => {
              const imageSrc = URL.createObjectURL(file);
              return (
                <div
                  key={`selected-${index}`}
                  className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith("video/") ? (
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
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            {/* Render uploaded images */}
            {currentDefaultImages.length > 0 && (
              <>
                {currentDefaultImages.map((image) => {
                  if (!image.url) return null;
                  return (
                    <div
                      key={`default-${image.id}`}
                      className="p-3 bg-gray-50 rounded-md flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        {image.url.endsWith(".mp4") ? (
                          <video
                            src={image.url}
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
                              src={image.url}
                              alt="Preview"
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                        )}
                        <div>
                          {image.name && (
                            <p className="text-sm font-medium">{image.name}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDefaultRemove(image.id)}
                        disabled={isUploading}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
