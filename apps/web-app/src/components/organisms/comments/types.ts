import { VstComment, CollectionComment } from "vst-database";

export type FormattedComment = (VstComment | CollectionComment) & {
  replies: (VstComment | CollectionComment)[];
};
