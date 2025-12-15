import { basename, dirname, join, parse, resolve } from "node:path";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { favicons } from "favicons";

const __dirname = dirname(fileURLToPath(import.meta.url));

const outputDir = resolve(__dirname, "..", "images/processed");
const sourceDir = resolve(__dirname, "..", "images/source");
const allowedExtensions = [".png", ".svg", ".jpg", ".jpeg", ".webp"];

const config = {
  path: "/",
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: true,
    yandex: false,
  },
};

async function main() {
  const sourceImages = await findSourceImages();

  await mkdir(outputDir, { recursive: true });

  for (const imagePath of sourceImages) {
    const subdir = parse(imagePath).name;
    const targetDir = join(outputDir, subdir);

    await rm(targetDir, { recursive: true, force: true });
    await mkdir(targetDir, { recursive: true });

    const { images, files, html } = await favicons(imagePath, config);

    await Promise.all(
      images.map(({ name, contents }) =>
        writeFile(join(targetDir, name), contents)
      )
    );

    await Promise.all(
      files.map(({ name, contents }) =>
        writeFile(join(targetDir, name), contents)
      )
    );

    await writeFile(join(targetDir, "head-tags.html"), html.join("\n"));

    console.log(
      `Favicons generated from ${basename(imagePath)} into ${targetDir}`
    );
  }

  console.log("Done. Each source image has its own processed subfolder.");
}

async function findSourceImages() {
  if (process.argv[2]) {
    const candidate = resolve(process.cwd(), process.argv[2]);
    if (
      !allowedExtensions.some((ext) =>
        candidate.toLowerCase().endsWith(ext.toLowerCase())
      )
    ) {
      throw new Error(
        `Source image must be one of: ${allowedExtensions.join(", ")}`
      );
    }
    return [candidate];
  }

  const entries = await readdir(sourceDir, { withFileTypes: true });
  const candidates = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        allowedExtensions.some((ext) => entry.name.toLowerCase().endsWith(ext))
    )
    .map((entry) => resolve(sourceDir, entry.name));

  if (candidates.length === 0) {
    throw new Error(
      `No source images found in ${sourceDir}. Place images (${allowedExtensions.join(
        ", "
      )}) there or pass a path as an argument.`
    );
  }

  return candidates;
}

main().catch((err) => {
  console.error("Failed to generate favicons:", err);
  process.exitCode = 1;
});
