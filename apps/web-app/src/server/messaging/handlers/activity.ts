import { Collection, Vst } from "@prisma/client";

interface Activity<T extends Vst | Collection> {
  type: string;
  data: T;
}
