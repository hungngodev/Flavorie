import { PostError } from "@src/errors/customErrors";
import PostModel from "@src/models/Post";
import UserModel from "@src/models/UserModel";
import { cloudinary } from "@src/services/cloudinary/cloudinaryServices";
import { NextFunction, Request, Response } from "express";

export const checkAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    const post = await PostModel.findOne({ _id: req.params.postid });
    if (!post) {
      throw new PostError("Post not found");
    }
    if (post.author.toString() !== req.user.userId) {
      throw new PostError("Author does not match");
    }
  } else {
    throw new PostError("No author");
  }
  next();
};

export const bindAuthor = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user) {
    const author = await UserModel.findById(req.user.userId);
    if (!author) {
      throw new PostError("Author not found");
    }
    req.body.author = req.user.userId;
  }
  next();
};

// uploading data to cloudinary works, but it cannot parse the req.body like multer. if this can be fix, then we can use this because it can upload large files
export const handleMediaFiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.files || !Array.isArray(req.files)) {
    return next();
  }

  try {
    const uploadedFiles = [];
    for (const file of req.files) {
      const uploadResult = await cloudinary.uploader.upload_large(file.path, {
        resource_type: file.mimetype.startsWith("video/") ? "video" : "image",
        chunk_size: 600000, // Adjust chunk size as necessary
        folder: process.env.CLOUDINARY_FOLDER || "",
        // use_filename: true,
        // unique_filename: false,
        // overwrite: true,
      });

      uploadedFiles.push({
        url: uploadResult.secure_url,
        type: file.mimetype.startsWith("video/") ? "video" : "image",
        metadata: [file.fieldname, file.originalname],
        description: file.originalname,
      });

      // Delete the temporary file
      // fs.unlinkSync(file.path);
    }

    req.body.media = uploadedFiles;
    return next();
  } catch (error) {
    return next(error);
  }
};
