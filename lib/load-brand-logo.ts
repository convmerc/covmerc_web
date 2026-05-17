import { readFile } from "node:fs/promises";
import { join } from "node:path";

const LOGO_PATH = join(process.cwd(), "public/brand/covmerc-logo.png");

let cachedLogoDataUrl: string | undefined;

/** Brand logo from the Covmerc app (`assets/images/png/logo.png`) as a data URL for OG generation. */
export async function loadBrandLogoDataUrl(): Promise<string> {
  if (cachedLogoDataUrl) return cachedLogoDataUrl;
  const buffer = await readFile(LOGO_PATH);
  cachedLogoDataUrl = `data:image/png;base64,${buffer.toString("base64")}`;
  return cachedLogoDataUrl;
}
