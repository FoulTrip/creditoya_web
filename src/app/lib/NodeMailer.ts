import nodemailer from "nodemailer";
import fs from "fs"

const email = process.env.GOOGLE_EMAIL;
const pass = process.env.GOOGLE_APP_KEY;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: email,
    pass,
  },
});

// Lee el archivo HTML con la plantilla de correo
const readHTMLFile = (path, callback) => {
  fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
    if (err) {
      callback(err);
    } else {
      callback(null, html);
    }
  });
};

// export const mailOptions = {
//     from: email,
//     to:
// }
