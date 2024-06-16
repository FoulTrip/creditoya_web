// import { NextResponse } from "next/server";
// import { tmpdir } from "os";
// import { join } from "path";
// import { promises as fs } from "fs";
// import TokenService from "@/classes/TokenServices";
// import { Storage } from "@google-cloud/storage";

// const storage = new Storage();

// export async function POST(req: Request) {
//   try {
//     // Verificar la autenticación JWT
//     const authorizationHeader = req.headers.get("Authorization");

//     if (!authorizationHeader) {
//       return NextResponse.json(
//         { message: "Token de autorización no proporcionado" },
//         { status: 401 }
//       );
//     }

//     const token = authorizationHeader.split(" ")[1];

//     const decodedToken = TokenService.verifyToken(
//       token,
//       process.env.JWT_SECRET as string
//     ); // Reemplaza "tu-clave-secreta" con tu clave secreta

//     if (!decodedToken) {
//       return NextResponse.json({ message: "Token no válido" }, { status: 401 });
//     }

//     const data = await req.formData();
//     const pdf = data.get("pdf");
//     const userId = data.get("userId");

//     console.log(pdf);

//     const reader = new FileReader();
//     reader.onload = async function (event) {
//       if (event.target && event.target.result) {
//         const arrayBuffer = event.target.result;
//         const uint8Array = new Uint8Array(arrayBuffer);
//         const buffer = Buffer.from(uint8Array);
//       } else {
//         console.error("Error: event.target.result es null");
//       }

//       const tempFilePath = join(
//         process.cwd(),
//         "public",
//         `${userId}-${Date.now()}.pdf`
//       );

//       console.log(tempFilePath);

//       // Se guarda en la ruta temporal
//       await fs.writeFile(tempFilePath, buffer);

//       const bucketName = process.env.NAME_BUCKET_GOOGLE_STORAGE;

//       const response = await storage
//         .bucket(bucketName as string)
//         .upload(tempFilePath);

//       console.log(response);
//       console.log(`${tempFilePath} uploaded to ${bucketName}`);
//     };

//     reader.readAsArrayBuffer(pdf);
//   } catch (error) {
//     if (error instanceof Error) {
//       return NextResponse.json({ success: false, error: error.message });
//     }
//   }
// }
