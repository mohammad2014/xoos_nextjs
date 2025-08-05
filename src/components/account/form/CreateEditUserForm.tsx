"use client";

import type React from "react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDictionary } from "@/hooks/use-dictionary";
import {
  getUserFormSchema,
  UpdateUserFormData,
  type UserFormData,
} from "@/schemas/userSchema";
import { DatePicker } from "../input/DatePicker";
import { SearchableCombobox } from "@/components/ui/SearchableCombobox";
import { createUser, updateUser } from "@/lib/api";
import { Heading } from "@/components/ui/Heading";
import TextInput from "@/components/account/input/TextInput";
import SelectField from "../input/SelectField";
import FileUploadInput from "../input/FileUploadInput";
import { useRouter } from "next/navigation";
import ContainerView from "../ContainerView";
import { Loader2 } from "lucide-react";
import PasswordInput from "../input/PasswordInput";
import { ImageTs } from "@/types/imageTs";
import FormSection from "../FormSection";

interface List {
  value: number;
  label: string;
}

interface CreateEditUserFormProps {
  rolesList: List[];
  cities: List[];
  defaultValue?: Partial<UserFormData> & { avatar?: ImageTs };
}

// Constants for select options
const STATUS_OPTIONS = [
  { value: "active", label: "فعال" },
  { value: "deactive", label: "غیرفعال" },
];

const GENDER_OPTIONS = [
  { value: "male", label: "مرد" },
  { value: "female", label: "زن" },
];

const LEVEL_OPTIONS = [
  { value: "gold", label: "طلایی" },
  { value: "silver", label: "نقره‌ای" },
  { value: "bronze", label: "برنزی" },
];

export default function CreateEditUserForm({
  rolesList,
  cities,
  defaultValue,
}: CreateEditUserFormProps) {
  const isEditSession = Boolean(defaultValue);
  const router = useRouter();
  const { dictionary } = useDictionary();
  const userFormSchema = getUserFormSchema(dictionary, isEditSession);
  const [avatarId, setAvatarId] = useState<number | null>(null);

  const filterDefaultValueWithoutNull = Object.fromEntries(
    Object.entries(defaultValue || {}).filter(([, value]) => value !== null)
  );
  const { id } = filterDefaultValueWithoutNull;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setError,
    setValue,
  } = useForm<UserFormData>({
    defaultValues: {
      status: "active",
      ...filterDefaultValueWithoutNull,
    },
    resolver: zodResolver(userFormSchema),
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      const submitData = { ...data };
      if (avatarId) {
        submitData.avatar_id = avatarId;
      }
      console.log(submitData);

      const result = isEditSession
        ? await updateUser(submitData as UpdateUserFormData, id as number)
        : await createUser(submitData);

      if (result.status === "success") {
        toast.success(result.message);
        setAvatarId(null);
        router.push("/admin/users");
      } else if (result.status === "validation_error" && result.data) {
        Object.entries(result.data).forEach(([fieldName, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            setError(fieldName as keyof UserFormData, {
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
  console.log(errors);

  return (
    <div className="space-y-4 w-full">
      <div className="space-y-2">
        <Heading level={3}>
          {isEditSession
            ? dictionary.common.edit + " " + dictionary.forms.user
            : dictionary.common.add + " " + dictionary.forms.user}
        </Heading>
        <p className="text-primary-600">
          {isEditSession
            ? dictionary.common.editItemDescription
            : dictionary.common.addItemDescription}
        </p>
      </div>
      <ContainerView>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Personal Information */}
          <FormSection title={dictionary.ui.form.personalInfo}>
            <TextInput
              label={`${dictionary.forms.firstname} `}
              name="first_name"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.firstname}
              disabled={isSubmitting}
            />
            <TextInput
              label={`${dictionary.forms.lastname} `}
              name="last_name"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.lastname}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.nickname + dictionary.common.optional}
              name="nickname"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.nickname}
              disabled={isSubmitting}
            />
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <SelectField
                  label={dictionary.forms.gender + dictionary.common.optional}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={GENDER_OPTIONS}
                  placeholder={dictionary.forms.gender}
                  disabled={isSubmitting}
                  error={errors.gender?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="birthdate_jalali"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  errors={errors}
                  placeholder={dictionary.forms.birthdate}
                  label={
                    dictionary.forms.birthdate + dictionary.common.optional
                  }
                  name="birthdate_jalali"
                />
              )}
            />
            <Controller
              control={control}
              name="date_marriage"
              render={({ field }) => (
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  errors={errors}
                  placeholder={dictionary.forms.dateMarriage}
                  label={
                    dictionary.forms.dateMarriage + dictionary.common.optional
                  }
                  name="date_marriage"
                />
              )}
            />
            <TextInput
              label={dictionary.forms.nationalCode + dictionary.common.optional}
              name="national_code"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.nationalCode}
              disabled={isSubmitting}
            />
          </FormSection>

          {/* Contact Information */}
          <FormSection title={dictionary.ui.form.contactInfo}>
            <TextInput
              label={`${dictionary.forms.mobile} `}
              name="mobile"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.mobile}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.email + dictionary.common.optional}
              name="email"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.email}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.phoneCode + dictionary.common.optional}
              name="phone_code"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.phoneCode}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.phone + dictionary.common.optional}
              name="phone"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.phone}
              disabled={isSubmitting}
            />
          </FormSection>

          {/* Address Information */}
          <FormSection title={dictionary.ui.form.addressInfo}>
            <Controller
              control={control}
              name="city_id"
              render={({ field }) => (
                <SearchableCombobox
                  options={cities}
                  value={field.value}
                  onValueChange={field.onChange}
                  label={dictionary.forms.city}
                  placeholder="انتخاب شهر"
                  disabled={isSubmitting}
                  error={errors.city_id?.message}
                />
              )}
            />
            <TextInput
              label={dictionary.forms.address + dictionary.common.optional}
              name="address"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.address}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.postalCode + dictionary.common.optional}
              name="postal_code"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.postalCode}
              disabled={isSubmitting}
            />
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
              <TextInput
                label={
                  dictionary.forms.address +
                  " " +
                  dictionary.forms.plaque +
                  dictionary.common.optional
                }
                name="address_plaque"
                register={register}
                errors={errors}
                placeholder={
                  dictionary.forms.address + " " + dictionary.forms.plaque
                }
                disabled={isSubmitting}
              />
              <TextInput
                label={
                  dictionary.forms.address +
                  " " +
                  dictionary.forms.floor +
                  dictionary.common.optional
                }
                name="address_floor"
                register={register}
                errors={errors}
                placeholder={
                  dictionary.forms.address + " " + dictionary.forms.floor
                }
                disabled={isSubmitting}
              />
              <TextInput
                label={
                  dictionary.forms.address +
                  " " +
                  dictionary.forms.unit +
                  dictionary.common.optional
                }
                name="address_unit"
                register={register}
                errors={errors}
                placeholder={
                  dictionary.forms.address + " " + dictionary.forms.unit
                }
                disabled={isSubmitting}
              />
            </div>
          </FormSection>

          {/* Additional Information */}
          <FormSection title={dictionary.ui.form.aditionalInfo}>
            {!isEditSession && (
              <PasswordInput
                label={dictionary.forms.password}
                name="password"
                register={register}
                errors={errors}
                placeholder={dictionary.forms.password}
                disabled={isSubmitting}
              />
            )}
            <Controller
              control={control}
              name="role_id"
              render={({ field }) => (
                <SearchableCombobox
                  options={rolesList}
                  value={field.value}
                  onValueChange={field.onChange}
                  label={dictionary.forms.role}
                  placeholder="انتخاب نقش"
                  disabled={isSubmitting}
                  error={errors.role_id?.message}
                />
              )}
            />
            <TextInput
              label={dictionary.forms.job + dictionary.common.optional}
              name="job"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.job}
              disabled={isSubmitting}
            />
            <TextInput
              label={dictionary.forms.education + dictionary.common.optional}
              name="education"
              register={register}
              errors={errors}
              placeholder={dictionary.forms.education}
              disabled={isSubmitting}
            />
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectField
                  label={dictionary.forms.status}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={STATUS_OPTIONS}
                  placeholder={dictionary.forms.status}
                  disabled={isSubmitting}
                  error={errors.status?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="level"
              render={({ field }) => (
                <SelectField
                  label={dictionary.forms.level + dictionary.common.optional}
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  options={LEVEL_OPTIONS}
                  placeholder={dictionary.forms.level}
                  disabled={isSubmitting}
                  error={errors.level?.message}
                />
              )}
            />
          </FormSection>

          {/* Avatar Upload */}
          <FormSection
            title={dictionary.forms.avatar + dictionary.common.optional}
          >
            <FileUploadInput
              accept="image/*"
              disabled={isSubmitting}
              onUploadSuccess={(image) => {
                const imageId = image?.id || null;
                setAvatarId(imageId);
                setValue("avatar_id", imageId || undefined);
              }}
              error={errors.avatar_id?.message}
              defaultImageUrl={defaultValue?.avatar?.url}
              defaultImageName={defaultValue?.avatar?.name}
            />
          </FormSection>

          {/* Submit Button */}
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
