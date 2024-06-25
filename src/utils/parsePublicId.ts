export default function parsePublicId(url: string) {
  const parts = url.split("/");
  const publicIdWithExtension = parts
    .slice(-2)
    .join("/")
    .split(".")
    .slice(0, -1)
    .join(".");
  return publicIdWithExtension.replace(/^v\d+\/(.+)$/, "$1");
}
