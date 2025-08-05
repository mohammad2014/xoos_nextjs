"use client";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import { getSliderFormSchema, SliderFormData } from "@/schemas/sliderSchema";
import { Heading } from "@/components/ui/Heading";
import FileUploadInput from "../input/FileUploadInput";
import { Loader2, Plus } from "lucide-react";
import { createSlider, updateSlider } from "@/lib/api";
import { Slider } from "@/models/slider-model";
import { useRouter } from "next/navigation";
import ContainerView from "../ContainerView";
import FormSection from "../FormSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextInput from "../input/TextInput";
interface CreateEditSliderFormProps {
  defaultValue?: Partial<Slider>;
}

export default function CreateEditSliderForm({
  defaultValue,
}: CreateEditSliderFormProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();
  const sliderFormSchema = getSliderFormSchema(dictionary);
  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );
  const { id } = filterDefaultValueWithoutNull;

  const [itemImageIds, setItemImageIds] = useState<(number | null)[]>(
    defaultValue?.items?.map((item) => item.image || null) || []
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<SliderFormData>({
    defaultValues: {
      items: [{ title: "", image: undefined, priority: 1 }],
      ...filterDefaultValueWithoutNull,
    },
    resolver: zodResolver(sliderFormSchema),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "items",
  });

  const onSubmit = async (data: SliderFormData) => {
    try {
      const submitData = { ...data };
      submitData.items = submitData.items.map(
        (item: SliderFormData["items"][number], index: number) => ({
          ...item,
          image: itemImageIds[index] ?? item.image,
        })
      );

      const result = isEditSession
        ? await updateSlider(submitData, id as number)
        : await createSlider(submitData);
      console.log(result);

      if (result.status === "success") {
        setItemImageIds([]);
        toast.success(result.message);
        router.push("/admin/sliders");
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof SliderFormData, {
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
            ? dictionary.common.edit + " " + dictionary.nav.slider
            : dictionary.common.add + " " + dictionary.nav.slider}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormSection title={dictionary.ui.form.sliderInfo}>
            <Tabs defaultValue="fa" className="w-full">
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
            <Tabs defaultValue="fa" className="w-full">
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
                  label={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                  name="description"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="en">
                <TextInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                  name="description_en"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
              <TabsContent value="ar">
                <TextInput
                  label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                  name="description_ar"
                  placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                  register={register}
                  errors={errors}
                />
              </TabsContent>
            </Tabs>
            <TextInput
              label={`${dictionary.forms.name} `}
              name="name"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.name}
              disabled={isSubmitting}
            />
          </FormSection>

          {/* Slider Items */}
          {fields.map((field, index) => (
            <FormSection
              key={field.id}
              title={`${dictionary.ui.form.sliderItem} ${index + 1}`}
              index={index}
              fieldsLength={fields.length}
              move={move}
              setItemImageIds={setItemImageIds}
              setValue={setValue}
              onRemove={fields.length > 1 ? () => remove(index) : undefined}
            >
              <Tabs defaultValue="fa" className="w-full">
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
                    label={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                    name={`items.${index}.title`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                    register={register}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    name={`items.${index}.title_en`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    register={register}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    name={`items.${index}.title_ar`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    register={register}
                    errors={errors}
                  />
                </TabsContent>
              </Tabs>

              <Tabs defaultValue="fa" className="w-full">
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
                    label={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    name={`items.${index}.description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    register={register}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    name={`items.${index}.description_en`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    register={register}
                    errors={errors}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    name={`items.${index}.description_ar`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    register={register}
                    errors={errors}
                  />
                </TabsContent>
              </Tabs>
              <TextInput
                label={`${dictionary.forms.link}`}
                name={`items.${index}.link`}
                register={register}
                errors={errors?.items?.[index]}
                placeholder={dictionary.forms.link}
                disabled={isSubmitting}
              />
              <TextInput
                label={`${dictionary.forms.buttonContent}`}
                name={`items.${index}.buttonContent`}
                register={register}
                errors={errors?.items?.[index]}
                placeholder={dictionary.forms.buttonContent}
                disabled={isSubmitting}
              />
              <input type="hidden" {...register(`items.${index}.priority`)} />
              <FileUploadInput
                accept="image/*,video/*"
                disabled={isSubmitting}
                onUploadSuccess={(image) => {
                  const imageId = image?.id || null;
                  setItemImageIds((prev) => {
                    const newIds = [...prev];
                    newIds[index] = imageId;
                    return newIds;
                  });
                  setValue(`items.${index}.image`, imageId as number);
                }}
                error={errors?.items?.[index]?.image?.message}
                defaultImageUrl={defaultValue?.items?.[index]?.image_info?.url}
              />
            </FormSection>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                title: "",
                image: 0,
                priority: fields.length + 1,
              });
              setItemImageIds((prev) => [...prev, null]);
            }}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4" />
            {dictionary.ui.form.sliderAdd}
          </Button>

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
