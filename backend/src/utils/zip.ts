import zlib from "zlib";

export function convertToGzipFormat(dict: object): string {
  // Convert the dictionary to a JSON string and encode it as a UTF-8 buffer
  const jsonString = JSON.stringify(dict);
  const stringifiedObject = Buffer.from(jsonString, "utf-8");

  // Compress the UTF-8 buffer using Gzip
  const compressedFile = zlib.gzipSync(stringifiedObject);

  // Encode the compressed file to a Base64 string
  const base64String = compressedFile.toString("base64");

  return base64String;
}

export function decompressFromGzipFormat(base64String: string): object {
  // Decode the Base64 string to get the compressed buffer
  const compressedFile = Buffer.from(base64String, "base64");

  // Decompress the buffer using Gzip
  const decompressedBuffer = zlib.gunzipSync(compressedFile);

  // Convert the decompressed buffer to a JSON string
  const jsonString = decompressedBuffer.toString("utf-8");

  // Parse the JSON string to an object
  const dict = JSON.parse(jsonString);

  return dict;
}
