"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Save, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useDictionary } from "@/hooks/use-dictionary";
import { getMenuFormSchema, type MenuFormData } from "@/schemas/menuSchema";
import type { ImageTs, MenuItem } from "@/types/menu";
import SelectField from "../../input/SelectField";
import TextInput from "../../input/TextInput";
import FileUploadInput from "../../input/FileUploadInput";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: MenuFormData,
    displayImageUrl?: string,
    displayImageName?: string
  ) => void;
  editingItem?: MenuItem | null;
  defaultLevel?: number;
}

const VALUE_OPTIONS = [
  {
    label: (
      <div className="flex items-center gap-2">
        <Badge className="bg-blue-100 text-blue-700">سطح 1</Badge>
        <span>منوی اصلی</span>
      </div>
    ),
    value: "1",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-700">سطح 2</Badge>
        <span>زیرمنو</span>
      </div>
    ),
    value: "2",
  },
  {
    label: (
      <div className="flex items-center gap-2">
        <Badge className="bg-purple-100 text-purple-700">سطح 3</Badge>
        <span>زیرمنوی عمقی</span>
      </div>
    ),
    value: "3",
  },
];

export default function MenuItemForm({
  isOpen,
  onClose,
  onSave,
  editingItem,
  defaultLevel,
}: Props) {
  const { dictionary } = useDictionary();
  const schema = getMenuFormSchema(dictionary);
  const [uploadedImage, setUploadedImage] = useState<ImageTs | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (editingItem) {
      reset({
        title: editingItem.title || "",
        title_en: editingItem.title_en || "",
        title_ar: editingItem.title_ar || "",
        link: editingItem.link || "",
        level: editingItem.level,
        image: editingItem.image || undefined,
      });
      if (editingItem.imageUrl) {
        setUploadedImage({
          id: Number(editingItem.image || editingItem.id),
          url: editingItem.imageUrl,
          name: editingItem.imageName || "",
        });
      } else {
        setUploadedImage(null);
      }
    } else {
      reset({
        title: "",
        title_en: "",
        title_ar: "",
        link: "",
        level: defaultLevel || 1,
        image: undefined,
      });
      setUploadedImage(null);
    }
  }, [editingItem, reset, setValue, defaultLevel]);

  const onSubmit = (data: MenuFormData) => {
    const submitData = { ...data };
    let finalImageUrl: string | undefined = undefined;
    let finalImageName: string | undefined = undefined;

    if (uploadedImage) {
      submitData.image = uploadedImage.id;
      finalImageUrl = uploadedImage.url;
      finalImageName = uploadedImage.name;
    } else if (editingItem && editingItem.image) {
      submitData.image = editingItem.image;
      finalImageUrl = editingItem.imageUrl;
      finalImageName = editingItem.imageName;
    } else {
      submitData.image = undefined;
      finalImageUrl = undefined;
      finalImageName = undefined;
    }

    onSave(submitData, finalImageUrl, finalImageName);
    reset();
    setUploadedImage(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-sm font-primary-bold text-primary-900">
            {editingItem ? "ویرایش منو" : dictionary.ui.form.menuAdd}
          </DialogTitle>
          <DialogDescription className="text-primary-600">
            {editingItem
              ? dictionary.common.editItemDescription
              : dictionary.common.addItemDescription}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            control={control}
            name="level"
            render={({ field }) => (
              <SelectField
                label="سطح منو"
                value={field.value?.toString() || "1"}
                onValueChange={(val) => field.onChange(Number(val))}
                options={VALUE_OPTIONS}
                placeholder="انتخاب سطح"
                disabled={isSubmitting}
                error={errors.level?.message}
              />
            )}
          />
          <Tabs defaultValue="fa" className="w-full">
            <TabsList className=" border border-muted">
              <TabsTrigger value="fa">{dictionary.ui.language.fa}</TabsTrigger>
              <TabsTrigger value="en">{dictionary.ui.language.en}</TabsTrigger>
              <TabsTrigger value="ar">{dictionary.ui.language.ar}</TabsTrigger>
            </TabsList>
            <TabsContent value="fa">
              <TextInput
                label={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                name="title"
                placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                register={register}
                errors={errors}
              />
            </TabsContent>
            <TabsContent value="en">
              <TextInput
                label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                name="title_en"
                placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                register={register}
                errors={errors}
              />
            </TabsContent>
            <TabsContent value="ar">
              <TextInput
                label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                name="title_ar"
                placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                register={register}
                errors={errors}
              />
            </TabsContent>
          </Tabs>
          <TextInput
            label={dictionary.forms.link}
            name="link"
            placeholder={dictionary.forms.linkPathPlaceholder}
            register={register}
            errors={errors}
          />
          <FileUploadInput
            accept="image/*"
            disabled={isSubmitting}
            onUploadSuccess={(uploaded) => {
              if (uploaded && uploaded.url) {
                setUploadedImage({
                  id: uploaded.id,
                  url: uploaded.url,
                  name: uploaded.name || "",
                });
                setValue("image", uploaded.id);
              } else {
                setUploadedImage(null);
                setValue("image", undefined);
              }
            }}
            defaultImageUrl={uploadedImage?.url || editingItem?.imageUrl}
            defaultImageName={uploadedImage?.name || editingItem?.imageName}
            error={errors.image?.message}
          />
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-1" />
              لغو
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-1" />
              {editingItem ? dictionary.common.save : dictionary.common.add}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
