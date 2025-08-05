"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import TextInput from "@/components/account/input/TextInput";
import SelectField from "@/components/account/input/SelectField";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { useDictionary } from "@/hooks/use-dictionary";
import { Social, SOCIAL_TYPES } from "@/models/social-model";
import { createSocailMedia, updateSocailMedia } from "@/lib/api";
import { getSocialFormSchema, SocialFormData } from "@/schemas/socialSchema";

interface CreateEditSocialFormProps {
  onSuccess: () => void;
  socialToEdit?: Partial<Social>;
}

export default function CreateEditSocialForm({
  onSuccess,
  socialToEdit = {},
}: CreateEditSocialFormProps) {
  const { id } = socialToEdit;
  const { dictionary } = useDictionary();
  const isEdit = Boolean(socialToEdit?.id);
  const socialFormSchema = getSocialFormSchema(dictionary);

  const STATUS_OPTIONS = [
    { value: "active", label: "فعال" },
    { value: "deactive", label: "غیرفعال" },
  ];

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialFormSchema),
    defaultValues: {
      type: socialToEdit.type,
      link: socialToEdit.link ?? "",
      status: socialToEdit.status ?? "active",
      title: socialToEdit.title ?? "",
      title_en: socialToEdit.title_en ?? "",
      title_ar: socialToEdit.title_ar ?? "",
    },
  });

  const onSubmit = async (data: SocialFormData) => {
    try {
      const result = isEdit
        ? await updateSocailMedia(data, id as number)
        : await createSocailMedia(data);
      console.log(result);

      if (result?.status === "success") {
        toast.success(result.message);
        onSuccess();
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages)) {
            setError(fieldName as keyof SocialFormData, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(
          isEdit ? dictionary.errors.updateError : dictionary.errors.createError
        );
      }
    } catch (err) {
      console.log(err);
      toast.error(
        isEdit ? dictionary.errors.updateError : dictionary.errors.createError
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full"
    >
      <Tabs defaultValue="fa" className="w-full">
        <TabsList className="border border-muted">
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
            disabled={isSubmitting}
          />
        </TabsContent>
        <TabsContent value="en">
          <TextInput
            label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
            name="title_en"
            placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </TabsContent>
        <TabsContent value="ar">
          <TextInput
            label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
            name="title_ar"
            placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
            register={register}
            errors={errors}
            disabled={isSubmitting}
          />
        </TabsContent>
      </Tabs>
      <TextInput
        label={dictionary.forms.link}
        name="link"
        register={register}
        errors={errors}
        placeholder={dictionary.forms.link}
        disabled={isSubmitting}
      />
      <Controller
        control={control}
        name="type"
        render={({ field }) => (
          <SelectField
            label={dictionary.forms.type}
            value={field.value || ""}
            onValueChange={field.onChange}
            options={SOCIAL_TYPES.map((key) => ({
              value: key,
              label: dictionary.ui.socialMedia[key],
            }))}
            error={errors.type?.message}
            disabled={isSubmitting}
            placeholder={dictionary.forms.type}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field }) => (
          <SelectField
            label={dictionary.forms.status}
            defaultValue="active"
            value={field.value || ""}
            onValueChange={field.onChange}
            options={STATUS_OPTIONS}
            placeholder={dictionary.forms.status}
            disabled={isSubmitting}
            error={errors.status?.message}
          />
        )}
      />
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-11 text-base"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" />
        ) : (
          dictionary.common.submit
        )}
      </Button>
    </form>
  );
}
