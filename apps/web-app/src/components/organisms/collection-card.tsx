import { Card, CardContent, CardHeader } from "vst-ui";

import { Collection } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@radix-ui/react-separator";
import CollectionHoverCard from "./collection-hover-card";

export function CollectionCard({ ...collection }: Collection) {
  return (
    <Link href={"/collections/" + collection.slug}>
      <CollectionHoverCard collectionSlug={collection.slug}>
        <Card
          className="
     h-full w-full
hover:ring hover:ring-ring"
        >
          <CardHeader className="flex flex-row items-center gap-x-3">
            {collection.iconUrl ? (
              <div className="relative aspect-square w-10 overflow-hidden rounded-md ">
                <Image
                  alt={collection.name + " icon"}
                  src={
                    collection.iconUrl ||
                    "https://assets.awwwards.com/awards/element/2023/05/6474daaa754f4831653517.png"
                  }
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="2rem"
                height="2rem"
              >
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
            )}

            <div>
              <div className="flex items-center gap-x-2 text-xs text-muted-foreground">
                <p className="text-xs text-muted-foreground">
                  {collection?.userName || "System"}
                </p>
              </div>
              <p className="text-xl text-foreground">{collection?.name}</p>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-y-5 pl-[72px] ">
            <div className="flex flex-row flex-wrap gap-2">
              {collection.hasOrder}
            </div>
            <Separator />

            <div className="flex flex-row  gap-x-5">
              <div className="flex flex-row items-center gap-x-1">
                <p className="text-xs text-muted-foreground">Likes</p>
                <p>{collection.countLikes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollectionHoverCard>
    </Link>
  );
}
