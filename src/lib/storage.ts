import { Storage } from "@google-cloud/storage";
import crediental from "@/components/Jsons/cloud.json";
import DecryptJson from "@/handlers/decryptJson";

export interface PropsUpload {
  file: File;
  userId: string;
  name: string;
}

export const UploadToGcs = async ({ file, userId, name }: PropsUpload) => {
  try {
    if (!file) throw new Error("No file provided");
    if (file.size < 1) throw new Error("File is empty");

    const EnCredential = crediental.k;
    const EnCrypt = DecryptJson({
      encryptedData: EnCredential,
      password: process.env.KEY_DECRYPT as string,
    });

    const buffer = await file.arrayBuffer();
    const storage = new Storage({
      projectId: process.env.PROJECT_ID_GOOGLE,
      credentials: EnCrypt,
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
  } catch (error) {
    console.log(error);
  }
};
