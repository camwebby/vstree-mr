import { Reorder } from "framer-motion";
import TableItem from "./table-item";

const VstDndList = ({ form }) => {
  return (
    <>
      <Reorder.Group
        axis="y"
        className="flex flex-col gap-2"
        as="div"
        values={form.watch("vsts")}
        onReorder={(items) => {
          form.setValue("vsts", items);
        }}
      >
        {form.watch("vsts")?.map((vst, indexInTable) => (
          <Reorder.Item
            drag={"y"}
            as="tr"
            className="flex w-full flex-wrap gap-3 rounded-md border bg-muted-foreground/5 p-5 backdrop-blur-md"
            key={vst.tempId}
            value={vst}
          >
            <TableItem
              vst={vst}
              indexInTable={indexInTable}
              onNoteChange={(note) => {
                const vsts = form.getValues("vsts");

                if (!vsts?.length) return;

                const index = vsts?.findIndex((v) => v.tempId === vst.tempId);

                vsts[index].note = note;

                form.setValue("vsts", vsts);
              }}
              onDelete={() => {
                const vsts = form.getValues("vsts") ?? [];

                const index = vsts?.findIndex((v) => v.tempId === vst.tempId);

                if (index === -1) return;

                vsts.splice(index, 1);

                form.setValue("vsts", vsts);
              }}
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </>
  );
};

export default VstDndList;
