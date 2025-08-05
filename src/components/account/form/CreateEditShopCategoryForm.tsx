"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import { Heading } from "@/components/ui/Heading";
import TextInput from "../input/TextInput";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContainerView from "../ContainerView";
import FormSection from "../FormSection";
import SelectField from "../input/SelectField";
import {
  getShopCategoryFormSchema,
  ShopCategoryFormData,
} from "@/schemas/shopCategorySchema";
import { useRouter } from "next/navigation";
import {
  createShopCategory,
  updateShopCategory,
} from "@/lib/api/shop-categories";
import { ShopCategory } from "@/models/shop-category-model";
import FileUploadInput from "../input/MultipleFileUploadInput";
import { useState } from "react";

interface List {
  value: string;
  label: string;
}

interface CreateEditShopCategoryProps {
  defaultValue?: Partial<ShopCategory>;
  shopCategoriesList: List[];
}

export default function CreateEditShopCategoryForm({
  defaultValue,
  shopCategoriesList,
}: CreateEditShopCategoryProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();
  const [currentImageIds, setCurrentImageIds] = useState(
    defaultValue?.images?.map((img) => img.id) || []
  );
  const [currentDefaultImages, setCurrentDefaultImages] = useState(
    defaultValue?.images || []
  );

  const shopCategoryFormSchema = getShopCategoryFormSchema(dictionary);

  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    control,
  } = useForm<ShopCategoryFormData>({
    resolver: zodResolver(shopCategoryFormSchema),
    defaultValues: {
      ...filterDefaultValueWithoutNull,
    },
  });

  const mainFields = ["title", "description"];
  const nonMultiLanguageFields = ["parent_id", "level"];
  const metaFields = ["meta_title", "meta_description", "meta_keywords"];
  const nonMultiLanguageMetaFields = ["meta_link_canonical"];

  const getLabelOrPlaceholder = (field: string, lang: string): string => {
    const baseField = field.replace(/_en|_ar/, "");
    const rawLabel =
      dictionary.forms[baseField as keyof typeof dictionary.forms] || baseField;
    const label = typeof rawLabel === "string" ? rawLabel : baseField;
    const langLabel =
      typeof dictionary.ui.language[
        lang as keyof typeof dictionary.ui.language
      ] === "string"
        ? dictionary.ui.language[lang as keyof typeof dictionary.ui.language]
        : lang;
    return `${label} ${langLabel}`;
  };

  const handleDefaultRemove = (id: number) => {
    // به‌روزرسانی currentImageIds
    setCurrentImageIds((prev) => prev.filter((imgId) => imgId !== id));
    // به‌روزرسانی currentDefaultImages برای حذف تصویر از DOM
    setCurrentDefaultImages((prev) => prev.filter((img) => img.id !== id));
  };

  const onSubmit = async (data: ShopCategoryFormData) => {
    try {
      const finalData = {
        ...data,
        images: currentImageIds,
      };
      const result = isEditSession
        ? await updateShopCategory(finalData, defaultValue?.id as number)
        : await createShopCategory(finalData);
      console.log(finalData);

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/shop/categories");
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof ShopCategoryFormData, {
              type: "server",
              message: messages.join("، "),
            });
          }
        });
        toast.error(result.message);
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error(dictionary.common.error);
    }
  };

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {isEditSession
            ? `${dictionary.common.edit} ${dictionary.nav.category}`
            : `${dictionary.common.add} ${dictionary.nav.category}`}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>

      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormSection title={dictionary.ui.form.categoryInfo}>
            {mainFields.map((baseField) => (
              <Tabs defaultValue="fa" className="w-full" key={baseField}>
                <TabsList className="border border-muted bg-primary-0">
                  <TabsTrigger
                    value="fa"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.fa}
                  </TabsTrigger>
                  <TabsTrigger
                    value="en"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.en}
                  </TabsTrigger>
                  <TabsTrigger
                    value="ar"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.ar}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fa">
                  <TextInput
                    label={getLabelOrPlaceholder(baseField, "fa")}
                    name={baseField}
                    placeholder={getLabelOrPlaceholder(baseField, "fa")}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </TabsContent>

                <TabsContent value="en">
                  <TextInput
                    label={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                    name={`${baseField}_en`}
                    placeholder={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </TabsContent>

                <TabsContent value="ar">
                  <TextInput
                    label={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                    name={`${baseField}_ar`}
                    placeholder={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </TabsContent>
              </Tabs>
            ))}
            {nonMultiLanguageFields.map((field) => {
              if (field === "parent_id") {
                return (
                  <Controller
                    key={field}
                    control={control}
                    name="parent_id"
                    render={({ field }) => (
                      <SelectField
                        label={dictionary.forms.parentCategory}
                        value={field.value?.toString() || ""}
                        onValueChange={(value) =>
                          field.onChange(value ? parseInt(value) : null)
                        }
                        options={shopCategoriesList}
                        placeholder={dictionary.forms.parentCategory}
                        disabled={isSubmitting || isEditSession}
                        error={errors.parent_id?.message}
                      />
                    )}
                  />
                );
              }
              if (field === "level") {
                return (
                  <TextInput
                    key={field}
                    label={dictionary.forms.level}
                    name={field}
                    register={register}
                    errors={errors}
                    type="number"
                    placeholder={dictionary.forms.level}
                  />
                );
              }
            })}
          </FormSection>

          <FormSection title={dictionary.ui.form.metaInfo}>
            {metaFields.map((baseField) => (
              <Tabs defaultValue="fa" className="w-full" key={baseField}>
                <TabsList className="border border-muted bg-primary-0">
                  <TabsTrigger
                    value="fa"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.fa}
                  </TabsTrigger>
                  <TabsTrigger
                    value="en"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.en}
                  </TabsTrigger>
                  <TabsTrigger
                    value="ar"
                    className="data-[state=active]:bg-muted"
                  >
                    {dictionary.ui.language.ar}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fa">
                  <TextInput
                    label={getLabelOrPlaceholder(baseField, "fa")}
                    name={baseField}
                    placeholder={getLabelOrPlaceholder(baseField, "fa")}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </TabsContent>

                <TabsContent value="en">
                  <TextInput
                    label={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                    name={`${baseField}_en`}
                    placeholder={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </TabsContent>

                <TabsContent value="ar">
                  <TextInput
                    label={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                    name={`${baseField}_ar`}
                    placeholder={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                    register={register}
                    errors={errors}
                    disabled={isSubmitting}
                  />
                </TabsContent>
              </Tabs>
            ))}
            {nonMultiLanguageMetaFields.map((field) => (
              <TextInput
                key={field}
                name={field}
                label={dictionary.forms.meta_link_canonical}
                register={register}
                errors={errors}
                placeholder={
                  dictionary.forms[field as keyof typeof dictionary.forms] ||
                  field
                }
                disabled={isSubmitting}
              />
            ))}
          </FormSection>
          <FormSection title={dictionary.ui.form.galleries}>
            <FileUploadInput
              multiple
              onUploadSuccess={(images) => {
                if (Array.isArray(images)) {
                  setCurrentImageIds((prev) => [
                    ...prev,
                    ...images.map((img) => img.id),
                  ]);
                }
              }}
              defaultImages={currentDefaultImages}
              onDefaultRemove={handleDefaultRemove}
            />
          </FormSection>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 text-base"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              dictionary.common.submit
            )}
          </Button>
        </form>
      </ContainerView>
    </div>
  );
}
