import crypto from "crypto";

export function uploadRandomKey(length: number = 6): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const randomBuffer = crypto.randomBytes(length);
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBuffer[i] % characters.length;
    result += characters[randomIndex];
  }

  return result;
}
