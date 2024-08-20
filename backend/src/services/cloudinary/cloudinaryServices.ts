import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";

type ResourceType = "image" | "video";

interface CloudinaryOptions {
  resource_type: ResourceType;
  chunk_size: number;
  folder: string;
  use_filename: boolean;
  unique_filename: boolean;
  overwrite: boolean;
  eager: { quality: "auto"; format: "auto" }[];
}

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_KEY || "",
  api_secret: process.env.CLOUDINARY_SECRET || "",
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: process.env.CLOUDINARY_FOLDER || "",
      allowedFormats: ["jpeg", "png", "jpg", "mp4", "avi", "mov"],
      resource_type: "auto",
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      chunk_size: 5000000, // 5MB
    };
  },
});

export { cloudinary, storage };
