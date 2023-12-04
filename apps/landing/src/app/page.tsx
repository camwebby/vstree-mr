import Footer from "@/components/footer";
import Header from "@/components/header";
import Hero from "@/components/hero";
import MediaAccord from "@/components/media-accord";
import { featuresContent } from "@/components/media-accord/consts";
import Showcase from "@/components/showcase";
import TextImage from "@/components/textImage";
import { givonic } from "@/fonts";

export default function Home() {
  return (
    <main
      className={`overflow-x-hidden max-w-screen bg-background ${givonic.className}`}
    >
      <Header />
      <Hero />
      <Showcase />
      <MediaAccord data={featuresContent} />
      <TextImage />
      <Footer />
    </main>
  );
}
