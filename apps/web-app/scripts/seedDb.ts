import { Vst } from "@prisma/client";
import * as fs from "fs";
import { db } from "@/server/db";
import { generateSlug } from "@/utils/generateSlug";

const readJSONFile = async (filePath: string) => {
  const data = fs.readFileSync(filePath);

  const jsonData = JSON.parse(data.toString());

  return jsonData;
};

const mapJSONVstToPrismaVst = (vst: any): Partial<Vst> => {
  const iconUrl = `https://vst-assets.s3.eu-west-1.amazonaws.com/vst-icon/${vst.display_name.replace(
    " ",
    "_",
  )}`;

  console.log({ iconUrl });

  return {
    name: vst.display_name,
    slug: generateSlug(vst.name),
    overview: "VST Overviews are coming soon!",
    iconUrl,
    releasedDate: new Date(),
    systemRequirements: vst.systemRequirements,
    creatorName: vst.manufacturer.name,
    tags: vst.tag_list,
    isInstrument: vst.is_instrument,
    priceType: vst.is_free ? 1 : 2,
  };
};

export const seed = async () => {
  const vsts = await readJSONFile("/Users/cameron/Documents/vst-data.json");

  const plugins = vsts.plugins;

  const promises = plugins.map(async (plugin: any) => {
    const prismaVst = mapJSONVstToPrismaVst(plugin);

    return db.vst.create({
      data: {
        slug: prismaVst.slug ?? "",
        name: prismaVst.name ?? "",
        overview: prismaVst.overview,
        iconUrl: prismaVst.iconUrl,
        releasedDate: prismaVst.releasedDate,
        systemRequirements: prismaVst.systemRequirements ?? "",
        creatorName: prismaVst.creatorName,
        tags: prismaVst.tags?.length ? prismaVst.tags : [],
        isInstrument: prismaVst.isInstrument,
        priceType: prismaVst.priceType,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  });

  // wait for all promises to resolve
  await Promise.all(promises);

  // wait 2 seconds for all promises to resolve
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await db.$disconnect();
};

await seed();
