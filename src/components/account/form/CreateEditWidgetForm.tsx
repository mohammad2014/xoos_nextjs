"use client";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import { Heading } from "@/components/ui/Heading";
import TextInput from "../input/TextInput";
import FileUploadInput from "../input/FileUploadInput";
import { Loader2, Plus } from "lucide-react";
import { useQueryState } from "nuqs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContainerView from "../ContainerView";
import FormSection from "../FormSection";
import AddItemSelect from "../AddItemSelect";
import { getWidgetFormSchema, WidgetFormData } from "@/schemas/widgetSchema";
import { Widget, WidgetTemplate } from "@/models/widget-model";
import { Options } from "@/types/options";
import { createWidget, updateWidget } from "@/lib/api";
import SelectField from "../input/SelectField";
import { useRouter } from "next/navigation";

interface CreateEditWidgetFormProps {
  widgetsTemplateList: Options;
  WidgetsTemplate: WidgetTemplate[];
  defaultValue?: Partial<Widget>;
}

const STATUS_OPTIONS: Options = [
  { value: "active", label: "فعال" },
  { value: "deactive", label: "غیرفعال" },
];

export default function CreateEditWidgetForm({
  widgetsTemplateList,
  WidgetsTemplate,
  defaultValue,
}: CreateEditWidgetFormProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();
  const [template, setTemplate] = useQueryState("template");

  useEffect(() => {
    if (defaultValue?.template_coding) {
      setTemplate(defaultValue.template_coding);
    }
  }, [defaultValue, setTemplate]);

  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );

  const widgetFormSchema = getWidgetFormSchema(dictionary);

  const fields = WidgetsTemplate.find((widget) => widget.coding === template)
    ?.fields || {
    main: [],
    items: [],
  };

  const hasItems = fields.items.length > 0;

  const [itemImageIds, setItemImageIds] = useState<(number | null)[]>(
    defaultValue?.items?.map((item) => item.image || null) ||
      (hasItems ? [null] : [])
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<WidgetFormData>({
    defaultValues: {
      ...filterDefaultValueWithoutNull,
      status: defaultValue?.status || "active",
      items: defaultValue?.items?.length
        ? defaultValue.items.map((item) => ({
            ...item,
            title: item.title || "",
            title_en: item.title_en || "",
            title_ar: item.title_ar || "",
            subtitle: item.subtitle || "",
            subtitle_en: item.subtitle_en || "",
            subtitle_ar: item.subtitle_ar || "",
            description: item.description || "",
            description_en: item.description_en || "",
            description_ar: item.description_ar || "",
            link: item.link || "",
            image: item.image || undefined,
            priority: item.priority || undefined,
          }))
        : hasItems
        ? [
            {
              title: "",
              title_en: "",
              title_ar: "",
              subtitle: "",
              subtitle_en: "",
              subtitle_ar: "",
              description: "",
              description_en: "",
              description_ar: "",
              link: "",
              image: undefined,
              priority: 1,
            },
          ]
        : [],
    },
    resolver: zodResolver(widgetFormSchema),
  });

  const {
    fields: items,
    append,
    remove,
    move,
  } = useFieldArray({
    control,
    name: "items",
  });

  const multilingualFields = ["title", "subtitle", "description"];
  const nonMultilingualMainFields = fields.main.filter(
    (field: string) =>
      !multilingualFields.some(
        (base) => field === base || field.startsWith(`${base}_`)
      ) &&
      field !== "priority" &&
      field !== "template_coding"
  );
  const multilingualMainGroups = multilingualFields.filter((base) =>
    fields.main.some(
      (field: string) => field === base || field.startsWith(`${base}_`)
    )
  );
  const nonMultilingualItemsFields = fields.items.filter(
    (field: string) =>
      !multilingualFields.some(
        (base) => field === base || field.startsWith(`${base}_`)
      ) && field !== "priority"
  );
  const multilingualItemsGroups = multilingualFields.filter((base) =>
    fields.items.some(
      (field: string) => field === base || field.startsWith(`${base}_`)
    )
  );

  const getLabelOrPlaceholder = (field: string, lang: string): string => {
    const baseField = field.replace(/_en|_ar/, "");

    const baseLabel =
      dictionary.forms[baseField as keyof typeof dictionary.forms] ?? baseField;
    const langLabel =
      dictionary.ui.language[lang as keyof typeof dictionary.ui.language] ??
      lang;

    return `${baseLabel} ${langLabel}`;
  };


  const onSubmit = async (data: WidgetFormData) => {
    try {
      const submitData = {
        ...data,
        items: data.items.map((item, index) => ({
          ...item,
          image: itemImageIds[index] ?? item.image,
        })),
      };
      console.log(submitData);
      console.log(isEditSession);

      const result = isEditSession
        ? await updateWidget(submitData, defaultValue?.id as number)
        : await createWidget(submitData);
      console.log(result);

      if (result.status === "success") {
        setItemImageIds([]);
        toast.success(result.message);
        router.push("/admin/widgets");
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof WidgetFormData, {
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
            ? `${dictionary.common.edit} ${dictionary.nav.widget}`
            : `${dictionary.common.add} ${dictionary.nav.widget}`}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      {!isEditSession && (
        <AddItemSelect
          label={`${dictionary.common.choose} ${dictionary.nav.widget}`}
          options={widgetsTemplateList}
          placeholder={dictionary.nav.homewidgets}
        />
      )}

      <ContainerView>
        {template ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
            <input
              type="hidden"
              value={template}
              {...register("template_coding")}
            />

            <FormSection title={dictionary.ui.form.widgetInfo}>
              {multilingualMainGroups.map((baseField) => (
                <Tabs defaultValue="fa" className="w-full" key={baseField}>
                  <TabsList className="border border-muted bg-primary-0">
                    {fields.main.includes(`${baseField}_en`) && (
                      <TabsTrigger
                        value="en"
                        className="data-[state=active]:bg-muted"
                      >
                        {dictionary.ui.language.en}
                      </TabsTrigger>
                    )}
                    {fields.main.includes(`${baseField}_ar`) && (
                      <TabsTrigger
                        value="ar"
                        className="data-[state=active]:bg-muted"
                      >
                        {dictionary.ui.language.ar}
                      </TabsTrigger>
                    )}
                    {fields.main.includes(baseField) && (
                      <TabsTrigger
                        value="fa"
                        className="data-[state=active]:bg-muted"
                      >
                        {dictionary.ui.language.fa}
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="fa">
                    {fields.main.includes(baseField) && (
                      <TextInput
                        label={getLabelOrPlaceholder(baseField, "fa")}
                        name={baseField}
                        placeholder={getLabelOrPlaceholder(baseField, "fa")}
                        register={register}
                        errors={errors}
                        disabled={isSubmitting}
                      />
                    )}
                  </TabsContent>

                  {fields.main.includes(`${baseField}_en`) && (
                    <TabsContent value="en">
                      <TextInput
                        label={getLabelOrPlaceholder(`${baseField}_en`, "en")}
                        name={`${baseField}_en`}
                        placeholder={getLabelOrPlaceholder(
                          `${baseField}_en`,
                          "en"
                        )}
                        register={register}
                        errors={errors}
                        disabled={isSubmitting}
                      />
                    </TabsContent>
                  )}

                  {fields.main.includes(`${baseField}_ar`) && (
                    <TabsContent value="ar">
                      <TextInput
                        label={getLabelOrPlaceholder(`${baseField}_ar`, "ar")}
                        name={`${baseField}_ar`}
                        placeholder={getLabelOrPlaceholder(
                          `${baseField}_ar`,
                          "ar"
                        )}
                        register={register}
                        errors={errors}
                        disabled={isSubmitting}
                      />
                    </TabsContent>
                  )}
                </Tabs>
              ))}
              {nonMultilingualMainFields.map((field: string) => {
                const rawLabel =
                  dictionary.forms[field as keyof typeof dictionary.forms] ||
                  field;
                const label = typeof rawLabel === "string" ? rawLabel : field;
                return field === "image" ? (
                  <FileUploadInput
                    key={field}
                    accept="image/*"
                    disabled={isSubmitting}
                    error={errors[field]?.message}
                    defaultImageUrl={defaultValue?.image_info?.url}
                    defaultImageName={defaultValue?.image_info?.name}
                    onUploadSuccess={(image) => {
                      const imageId = image?.id || null;
                      setValue(field, imageId as number);
                    }}
                  />
                ) : (
                  <TextInput
                    key={field}
                    label={label}
                    name={field}
                    register={register}
                    errors={errors}
                    placeholder={label}
                    disabled={isSubmitting}
                  />
                );
              })}
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
            </FormSection>

            {(multilingualItemsGroups.length > 0 ||
              nonMultilingualItemsFields.length > 0) && (
              <>
                {items.map((item, index) => (
                  <FormSection
                    key={item.id}
                    title={`${dictionary.ui.form.widgetItem} ${index + 1}`}
                    index={index}
                    fieldsLength={items.length}
                    move={move}
                    setItemImageIds={setItemImageIds}
                    setValue={setValue}
                    onRemove={
                      items.length > 1 ? () => remove(index) : undefined
                    }
                  >
                    {multilingualItemsGroups.map((baseField) => (
                      <Tabs
                        defaultValue="fa"
                        className="w-full"
                        key={`${baseField}_${index}`}
                      >
                        <TabsList className="border border-muted bg-primary-0">
                          {fields.items.includes(`${baseField}_en`) && (
                            <TabsTrigger
                              value="en"
                              className="data-[state=active]:bg-muted"
                            >
                              {dictionary.ui.language.en}
                            </TabsTrigger>
                          )}
                          {fields.items.includes(`${baseField}_ar`) && (
                            <TabsTrigger
                              value="ar"
                              className="data-[state=active]:bg-muted"
                            >
                              {dictionary.ui.language.ar}
                            </TabsTrigger>
                          )}
                          {fields.items.includes(baseField) && (
                            <TabsTrigger
                              value="fa"
                              className="data-[state=active]:bg-muted"
                            >
                              {dictionary.ui.language.fa}
                            </TabsTrigger>
                          )}
                        </TabsList>

                        <TabsContent value="fa">
                          {fields.items.includes(baseField) && (
                            <TextInput
                              label={getLabelOrPlaceholder(baseField, "fa")}
                              name={`items.${index}.${baseField}`}
                              placeholder={getLabelOrPlaceholder(
                                baseField,
                                "fa"
                              )}
                              register={register}
                              errors={errors?.items?.[index]}
                              disabled={isSubmitting}
                            />
                          )}
                        </TabsContent>

                        {fields.items.includes(`${baseField}_en`) && (
                          <TabsContent value="en">
                            <TextInput
                              label={getLabelOrPlaceholder(
                                `${baseField}_en`,
                                "en"
                              )}
                              name={`items.${index}.${baseField}_en`}
                              placeholder={getLabelOrPlaceholder(
                                `${baseField}_en`,
                                "en"
                              )}
                              register={register}
                              errors={errors?.items?.[index]}
                              disabled={isSubmitting}
                            />
                          </TabsContent>
                        )}

                        {fields.items.includes(`${baseField}_ar`) && (
                          <TabsContent value="ar">
                            <TextInput
                              label={getLabelOrPlaceholder(
                                `${baseField}_ar`,
                                "ar"
                              )}
                              name={`items.${index}.${baseField}_ar`}
                              placeholder={getLabelOrPlaceholder(
                                `${baseField}_ar`,
                                "ar"
                              )}
                              register={register}
                              errors={errors?.items?.[index]}
                              disabled={isSubmitting}
                            />
                          </TabsContent>
                        )}
                      </Tabs>
                    ))}

                    {nonMultilingualItemsFields.map((field: string) => {
                      const rawLabel =
                        dictionary.forms[
                          field as keyof typeof dictionary.forms
                        ] || field;
                      const label =
                        typeof rawLabel === "string" ? rawLabel : field;
                      return field === "image" ? (
                        <FileUploadInput
                          key={`${field}_${index}`}
                          accept="image/*"
                          disabled={isSubmitting}
                          error={errors?.items?.[index]?.[field]?.message}
                          defaultImageUrl={
                            defaultValue?.items?.[index]?.image_info?.url
                          }
                          defaultImageName={
                            defaultValue?.items?.[index]?.image_info?.name
                          }
                          onUploadSuccess={(image) => {
                            const imageId = image?.id || null;
                            setItemImageIds((prev) => {
                              const newIds = [...prev];
                              newIds[index] = imageId;
                              return newIds;
                            });
                            setValue(`items.${index}.image`, imageId as number);
                          }}
                        />
                      ) : (
                        <TextInput
                          key={`${field}_${index}`}
                          label={label}
                          name={`items.${index}.${field}`}
                          register={register}
                          errors={errors?.items?.[index]}
                          placeholder={label}
                          disabled={isSubmitting}
                        />
                      );
                    })}

                    <input
                      type="hidden"
                      {...register(`items.${index}.priority`)}
                    />
                  </FormSection>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    append({
                      title: "",
                      title_en: "",
                      title_ar: "",
                      subtitle: "",
                      subtitle_en: "",
                      subtitle_ar: "",
                      description: "",
                      description_en: "",
                      description_ar: "",
                      image: undefined,
                      priority: items.length + 1,
                      link: "",
                    });
                    setItemImageIds((prev) => [...prev, null]);
                  }}
                  disabled={isSubmitting}
                >
                  <Plus className="h-4 w-4" />
                  {dictionary.ui.form.widgetAdd}
                </Button>
              </>
            )}

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
        ) : (
          <p className="m-auto">لطفا یک ویجت انتخاب کنید</p>
        )}
      </ContainerView>
    </div>
  );
}
