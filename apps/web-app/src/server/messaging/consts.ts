import { collectionCountIncrement } from "./handlers/collection";
import { vstCountIncrement } from "./handlers/vst";
import {
  Collection,
  UserCollectionAssociation,
  UserVstAssociation,
  VstComment,
} from "@prisma/client";

export const messageTypeCallbackMap = {
  likesAt: (data: UserVstAssociation) => {
    return vstCountIncrement(data, "likesAt");
  },
  wantsAt: (data: UserVstAssociation) => {
    return vstCountIncrement(data, "wantsAt");
  },
  ownsAt: (data: UserVstAssociation) => {
    return vstCountIncrement(data, "ownsAt");
  },
  collectionLikesAt: (data: UserCollectionAssociation) =>
    collectionCountIncrement(data, "likesAt"),
  collectionCreate: (data: Collection) => {},
  /**
   *
   */
  // newVstComment: (data: VstComment) => vstCountCommentIncrement(data, "commentsAt"),

  // newCollectionComment: (data: VstComment) => true,
} as const;
