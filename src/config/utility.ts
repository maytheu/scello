import { Files, Part } from "formidable";

export const imageOption = {
  multiples: false,
  maxFileSize: 16 * 1024 * 1024,
  filter: (mimetype: Part) =>
    !!(mimetype.mimetype && mimetype.mimetype.includes("image")),
};

export const formidableFileImages = (files: Files) => {
  if (files.image instanceof Array) {
    return files.image[0];
  } else return files.image;
};
