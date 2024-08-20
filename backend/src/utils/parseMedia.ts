// this util function converts cloudinary files into savable fields in the Post database
export default function parseMedia(originalFiles: any) {
  if (!originalFiles) {
    return [];
  }
  return originalFiles.map((file: any) => ({
    type: file.mimetype.startsWith("image") ? "image" : "video",
    url: file.path,
    metadata: [file.fieldname, file.originalname],
    description: file.originalName,
  }));
}
