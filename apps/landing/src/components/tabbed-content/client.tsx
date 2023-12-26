"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "vst-ui";
import TextAndImage from "../text-and-image";
import CollectionIcon from "vst-ui/src/assets/icons/collection";

const TabbedContentTabs = () => {
  return (
    <Tabs
      defaultValue="library"
      className=" mx-auto w-fit flex flex-col"
    >
      <TabsList className="border border-border/50 bg-foreground rounded-full mx-auto">
        <TabsTrigger className="rounded-full" value="library">
          Add to library
        </TabsTrigger>
        <TabsTrigger value="wishlist">Add to wishlist</TabsTrigger>
        <TabsTrigger value="like">Give it a like</TabsTrigger>
      </TabsList>
      <TabsContent value="library">
        <TextAndImage
          title="Add to library"
          description="You can group, sort and design collections of your favourite vsts. Add notes against an effect or instrument to let people know how to use an effect in the context your collection. You can share collections with your friends, or keep them all to yourself."
          imageSource="/screenshots/vsts.png"
        />
      </TabsContent>
      <TabsContent value="wishlist">
        <TextAndImage
          title="Add to wishlist"
          description="You can group, sort and design collections of your favourite vsts. Add notes against an effect or instrument to let people know how to use an effect in the context your collection. You can share collections with your friends, or keep them all to yourself."
          imageSource="/screenshots/vsts.png"
        />
      </TabsContent>
      <TabsContent value="like">
        <TextAndImage
          title="Give it a like"
          description="You can group, sort and design collections of your favourite vsts. Add notes against an effect or instrument to let people know how to use an effect in the context your collection. You can share collections with your friends, or keep them all to yourself."
          imageSource="/screenshots/vsts.png"
        />
      </TabsContent>
    </Tabs>
  );
};

export default TabbedContentTabs;
