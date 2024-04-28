import { Collection, Vst } from "vst-database";

interface Activity<T extends Vst | Collection> {
  type: string;
  data: T;
}
