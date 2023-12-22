import { getTextContent, setupPage } from ".";

/**
 *
 * @param fetchSchema - { [field_name]: [xpath] }
 * @returns {ScrapeCallback<Record<string, string>>} - { [field_name]: [value] }
 */
export const scrapeByUrlAndXpathSchema = async (
  url: string,
  fetchSchema: Record<string, string>
): Promise<Record<string, string>> => {
  const { browser, page } = await setupPage(url);

  const output: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(fetchSchema)) {
    const textValue = await getTextContent(page, value);

    if (!value) {
      output[key] = null;
      continue;
    }

    output[key] = textValue;
  }

  await browser.close();

  return output as Record<string, string>;
};
