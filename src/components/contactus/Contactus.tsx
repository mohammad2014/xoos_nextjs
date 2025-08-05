"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../account/input/TextInput";
import { Heading } from "../ui/Heading";
import { ContactUsData, contactUsSchema } from "@/schemas/contactUsSchema";
import CustomButton from "../shared/CustomButton";

export default function ContactUs() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactUsData>({
    resolver: zodResolver(contactUsSchema),
  });

  const onSubmit = (data: ContactUsData) => {
    console.log("Submitted:", data);
  };

  return (
    <div className="bg-primary-100 p-5">
      <header className="mb-10">
        <Heading level={2}>تماس با ما</Heading>
      </header>

      <form className="flex flex-col gap-10" onSubmit={handleSubmit(onSubmit)}>
        <div className="h-20">
          <TextInput
            placeholder="نام خانوادگی"
            variant="secondary"
            label=""
            register={register}
            name="lastName"
            errors={errors}
            inputClassName="w-full"
          />
        </div>
        <div className="h-20">
          <TextInput
            placeholder="شماره تلفن"
            variant="secondary"
            label=""
            register={register}
            name="phoneNumber"
            errors={errors}
            inputClassName="w-full"
          />
        </div>
        <div className="h-20">
          <TextInput
            placeholder="ایمیل"
            variant="secondary"
            label=""
            register={register}
            name="email"
            errors={errors}
            inputClassName="w-full"
          />
        </div>
        <div className="h-20">
          <TextInput
            placeholder="موضوع پیام"
            variant="secondary"
            label=""
            register={register}
            name="subject"
            errors={errors}
            inputClassName="w-full"
          />
        </div>
        <div className="h-20">
          <TextInput
            placeholder="پیام خود را اینجا بنویسید"
            variant="secondary"
            label=""
            register={register}
            name="message"
            errors={errors}
            inputClassName="w-full"
          />
        </div>
        <CustomButton type="submit">ارسال</CustomButton>
      </form>
    </div>
  );
}
