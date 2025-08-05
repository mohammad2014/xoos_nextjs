import ContactUs from "@/components/contactus/Contactus";
import FirstSection from "@/components/contactus/FirstSection";
import Container from "@/components/shared/Container";
import { Separator } from "@/components/ui/separator";

export default function ContactUsPage() {
  return (
    <Container className="flex flex-col gap-y-10 pt-10 lg:pt-20 md:px-8 lg:px-40">
      <FirstSection />
      <Separator className="bg-primary-400" />
      <ContactUs />
    </Container>
  );
}
