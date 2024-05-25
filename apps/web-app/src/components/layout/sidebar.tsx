import { NewCollectionContext } from "@/contexts/new-collection";
import { PencilIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import router from "next/router";
import React, { memo, useContext } from "react";
import { Button, StackIcon } from "vst-ui";
import { CollectionIcon, EffectIcon } from "vst-ui/src/assets";

const Sidebar = () => {
  const {
    showNewCollectionForm,
    setShowNewCollectionForm,
    setMinimized,
    form,
  } = useContext(NewCollectionContext);

  return (
    <div
      className="
sticky top-0  col-span-1
hidden  h-screen flex-col gap-y-2 overflow-x-hidden bg-background p-5 lg:col-span-1 lg:flex"
    >
      <Button
        asChild
        variant={router.pathname === "/" ? "secondary" : "ghost"}
        className="w-full justify-start"
      >
        <Link href="/" className="gap-x-2">
          <EffectIcon className="h-5 w-5" />
          <span>VSTs</span>
        </Link>
      </Button>
      <Button
        variant={router.pathname === "/collections" ? "secondary" : "ghost"}
        className="w-full justify-start"
        asChild
      >
        <Link href="/collections" className="gap-x-2">
          <StackIcon className="h-5 w-5" />
          <span>Collections</span>
        </Link>
      </Button>

      <div className="flex-grow" />
      <Button
        onClick={() => {
          if (showNewCollectionForm) {
            setMinimized(false);
          }
          setShowNewCollectionForm(true);
          setMinimized(false);
        }}
        className="rounded-md p-3 "
      >
        {showNewCollectionForm ? (
          <div className="flex items-center text-sm font-normal">
            <PencilIcon size={14} className="mr-2" />
            <span>Edit {form.getValues("collectionName") || "Collection"}</span>
          </div>
        ) : (
          <div className="flex items-center text-sm font-normal">
            <PlusIcon size={14} className="mr-2" />
            Create collection
          </div>
        )}
      </Button>
      <div className="my-10" />
    </div>
  );
};

export default memo(Sidebar);
