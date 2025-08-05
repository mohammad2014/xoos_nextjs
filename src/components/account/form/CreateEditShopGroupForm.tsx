"use client";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import {
  getShopGroupFormSchema,
  ShopGroupFormData,
} from "@/schemas/shopGroupSchema";
import { Heading } from "@/components/ui/Heading";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import ContainerView from "../ContainerView";
import FormSection from "../FormSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TextInput from "../input/TextInput";
import { createShopGroup, updateShopGroup } from "@/lib/api/shop-groups";
import { ShopGroup } from "@/models/shop-group-model";

interface CreateEditShopGroupFormProps {
  defaultValue?: Partial<ShopGroup>;
}

export default function CreateEditShopGroupForm({
  defaultValue,
}: CreateEditShopGroupFormProps) {
  const router = useRouter();
  const isEditSession = Boolean(defaultValue);
  const { dictionary } = useDictionary();
  const shopGroupFormSchema = getShopGroupFormSchema(dictionary);
  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );
  const { id } = filterDefaultValueWithoutNull;
  console.log(defaultValue);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ShopGroupFormData>({
    defaultValues: {
      meta: [{ name: "", title: "", priority: 1 }],
      ...filterDefaultValueWithoutNull,
    },
    resolver: zodResolver(shopGroupFormSchema),
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "meta",
  });

  const onSubmit = async (data: ShopGroupFormData) => {
    try {
      const submitData = { ...data };
      const result = isEditSession
        ? await updateShopGroup(submitData, id as number)
        : await createShopGroup(submitData);
      console.log(result);

      if (result.status === "success") {
        toast.success(result.message);
        router.push("/admin/shop/groups");
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof ShopGroupFormData, {
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
            ? dictionary.common.edit + " " + dictionary.nav.group
            : dictionary.common.add + " " + dictionary.nav.group}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <FormSection title={dictionary.ui.form.groupInfo}>
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
          </FormSection>

          {/* Shop Group Items */}
          {fields.map((field, index) => (
            <FormSection
              key={field.id}
              title={`${dictionary.ui.form.metaItem} ${index + 1}`}
              index={index}
              fieldsLength={fields.length}
              move={move}
              onRemove={fields.length > 1 ? () => remove(index) : undefined}
            >
              <TextInput
                label={`${dictionary.forms.name}`}
                name={`meta.${index}.name`}
                placeholder={dictionary.forms.name}
                register={register}
                errors={errors?.meta?.[index]}
                disabled={isSubmitting}
              />
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
                    name={`meta.${index}.title`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.fa}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    name={`meta.${index}.en_title`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.en}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    name={`meta.${index}.ar_title`}
                    placeholder={`${dictionary.forms.title} ${dictionary.ui.language.ar}`}
                    register={register}
                    errors={errors?.meta?.[index]}
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
                    name={`meta.${index}.description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.fa}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="en">
                  <TextInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    name={`meta.${index}.en_description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.en}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
                <TabsContent value="ar">
                  <TextInput
                    label={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    name={`meta.${index}.ar_description`}
                    placeholder={`${dictionary.forms.description} ${dictionary.ui.language.ar}`}
                    register={register}
                    errors={errors?.meta?.[index]}
                  />
                </TabsContent>
              </Tabs>
              <input type="hidden" {...register(`meta.${index}.priority`)} />
            </FormSection>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                name: "",
                title: "",
                priority: fields.length + 1,
              });
            }}
            disabled={isSubmitting}
          >
            <Plus className="h-4 w-4" />
            {dictionary.ui.form.metaAdd}
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
