import imglyRemoveBackground from "@imgly/background-removal";

export async function RemoveImage(img: File): Promise<File | null> {
  try {
    const img_src: ImageData | ArrayBuffer | Uint8Array | Blob | URL | string =
      URL.createObjectURL(img);

    console.log(img_src);

    const blob: Blob = await imglyRemoveBackground(img_src);

    const fileName = img.name;

    const proccessedFile = new File([blob], fileName, { type: blob.type });

    return proccessedFile;
  } catch (error) {
    console.log("Error al eliminar fondo: ", error);
    return null;
  }
}
