const { src, dest, series, task } = require("gulp");
const toIco = require("gulp-to-ico");
const imageResize = require("gulp-image-resize");
const rename = require("gulp-rename");

const iconSizes = [16, 32, 64, 96, 120, 128, 152, 167, 180, 196];
const iconTasks = [];

iconSizes.forEach((size) => {
  iconTasks.push(() => {
    return src(["images/source/*"])
      .pipe(
        imageResize({
          width: size,
          height: size,
          crop: true,
          upscale: false,
          format: "png",
        })
      )
      .pipe(
        rename({
          basename: "favicon",
          suffix: `-${size}`,
        })
      )
      .pipe(dest("images/processed/"));
  });
});

function createIco() {
  return src(["images/source/*"])
    .pipe(toIco("favicon.ico", { resize: true, sizes: iconSizes }))
    .pipe(dest("images/processed/"));
}

const generate = series(createIco, ...iconTasks);

task("default", generate);
