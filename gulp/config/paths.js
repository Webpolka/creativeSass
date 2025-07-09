import path from "path";

const buildFolder = "./dist";
const srcFolder = "./src";

const filePaths = {
  build: {
    js: `${buildFolder}/js/`,
    css: `${buildFolder}/css/`,
    images: `${buildFolder}/images/`,
    svg: `${buildFolder}/icons/`,
    fonts: `${buildFolder}/fonts/`,
    static: `${buildFolder}/vendor/`,
    postcss: `${buildFolder}/postcss/`,
  },
  src: {
    js: `${srcFolder}/js/*.js`,
    images: `${srcFolder}/images/**/*.{jpg,svg,jpeg,png,gif,webp}`,
    svg: `${srcFolder}/icons/*.svg`,
    scss: [`${srcFolder}/scss/main.scss`, `!${srcFolder}/scss/**/_*.scss`, `${srcFolder}/scss/pages/*.scss`],
    html: `${srcFolder}/*.html`,
    static: `${srcFolder}/vendor/**/*.*`,
    svgIcons: `${srcFolder}/icons/*.svg`,
    fontFacesFile: `${srcFolder}/scss/config/fonts.scss`,
    fonts: `${srcFolder}/fonts/`,
    postcss: [`${buildFolder}/css/*.css`,`${buildFolder}/css/**/*.css`],
  },
  watch: {
    js: [`${srcFolder}/js/**/*.js`, `${srcFolder}/vendor/*.js`],
    scss: `${srcFolder}/scss/**/*.scss`,
    html: `${srcFolder}/**/*.html`,
    images: `${srcFolder}/**/*.{jpg,jpeg,png,svg,gif,webp,ico}`,
    svg: `${srcFolder}/icons/*.svg`,
    static: `${srcFolder}/vendor/**/*.*`,
  },
  buildFolder,
  srcFolder,
  projectDirName: path.basename(path.resolve()),
  ftp: ``, // Путь к нужной папке на удаленном сервере. Gulp добавит имя папки проекта автоматически
};

export { filePaths };
