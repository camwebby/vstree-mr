import FAQs from "@/components/faqs";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Button from "@/components/button";
import { givonic } from "vst-ui/src/fonts";
import MediaAccord from "@/components/media-accord";
import TextAndImage from "@/components/text-and-image";
import FilterIcon from "vst-ui/src/assets/icons/filter";
import SearchIcon from "vst-ui/src/assets/icons/search";
import { vstActionsContent } from "@/content/vst-actions";
import ShoppingIcon from "vst-ui/src/assets/icons/shopping";
import CollectionIcon from "vst-ui/src/assets/icons/collection";

export default function Home() {
  return (
    <main
      className={`overflow-x-hidden max-w-screen bg-background ${givonic.className}`}
    >
      <Header />
      <Hero />

      <div
        id="features"
        className="bg-foreground py-12 flex lg:justify-center items-center"
      >
        <div className="container ">
          <p className="text-primary text-left lg:text-center">Features</p>
          <h2 className="text-3xl lg:text-5xl font-bold text-background/90  text-left lg:text-center text-balance">
            So what can it do?
          </h2>
        </div>
      </div>
      <TextAndImage
        title="Create
        collections"
        description="You can group, sort and design collections of your favourite vsts. Add notes against an effect or instrument to let people know how to use an effect in the context your collection. You can share collections with your friends, or keep them all to yourself."
        imageSource="/collection.gif"
        icon={<CollectionIcon />}
      />
      <TextAndImage
        title="Find where you can buy"
        description="Powered by the community, helpful volunteers locate the best places to download and buy vsts for supported currencies."
        imageSource="/prices.webm"
        reverse
        icon={<ShoppingIcon />}
      />
      <TextAndImage
        title="Compatibility with your system"
        description="Thinking of upgrading your operating system but not sure if it’ll affect your Serum patch? Enter your system’s detail into vstree to see whether users with a similar system to yours have any issues."
        imageSource="/screenshots/vsts.png"
        icon={<FilterIcon />}
      />
      <TextAndImage
        title="Filter search and explore"
        reverse
        description="Search by tags, vst manufacturers, instruments and effects."
        imageSource="/screenshots/vsts.png"
        icon={<SearchIcon />}
      />
      <MediaAccord data={vstActionsContent} />
      <FAQs />
      <div className="w-screen pb-5 bg-background">
        <div className="container pt-16 lg:pt-32 justify items-center justify-center">
          <h3 className="text-3xl text-foreground lg:text-5xl font-semibold text-center mb-4 lg:mb-6">
            Try for free today
          </h3>
          <div className="mx-auto w-fit">
            <Button>Get started</Button>
          </div>
        </div>

        {/* <MediaAccord id="features" data={featuresContent} /> */}
        <Footer />
      </div>
    </main>
  );
}
