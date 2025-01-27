import { v2 as cloudinary } from "cloudinary";
import { env } from "./validate";

interface CloudinaryResp {
  secure_url: string;
}

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

export const uploadImage = async (
  image: string
): Promise<CloudinaryResp | Error> => {
  try {
    return await cloudinary.uploader.upload(image);
  } catch (error) {
    return error as Error;
  }
};
