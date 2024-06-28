import { Storage } from "@google-cloud/storage";
import credentials from "../../credentials/deft-condition-404103-d030580a86e2.json";
import { NextResponse } from "next/server";

export interface PropsUpload {
  file: File;
  userId: string;
  name: string;
}

export const UploadToGcs = async ({
  file,
  userId,
  name,
}: PropsUpload) => {
  if (!file) throw new Error("No file provided");
  if (file.size < 1) throw new Error("File is empty");

  console.log(process.env.GOOGLE_PRODUCT_EMAIL);
  console.log(process.env.PRIVATE_KEY);

  const buffer = await file.arrayBuffer();
  const storage = new Storage({
    projectId: process.env.PROJECT_ID_GOOGLE,
    credentials,
  });
  console.log(Buffer.from(buffer));

  const fileName = `${name}-${userId}.pdf`;

  await storage
    .bucket(process.env.NAME_BUCKET_GOOGLE_STORAGE as string)
    .file(fileName)
    .save(Buffer.from(buffer))
    .catch((error) => {
      throw new Error(error.message);
    });

  return {
    success: true,
    public_name: fileName,
  };
};
