import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "vst-ui";

const VSTAvatar = ({
  item,
  className,
}: {
  item: { name: string; iconUrl: string | null };
  className?: string;
}) => {
  return (
    <Avatar className={className || "h-10 w-10"}>
      <AvatarImage className="object-cover" src={item?.iconUrl || ""} />
      <AvatarFallback>
        <span className="text-2xl">{item?.name.charAt(0).toUpperCase()}</span>
      </AvatarFallback>
    </Avatar>
  );
};

export default VSTAvatar;
