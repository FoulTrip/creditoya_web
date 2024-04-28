export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("El resultado del lector no es una cadena"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
