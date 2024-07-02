const CryptoJS = require("crypto-js");

const json_data = {
  type: "service_account",
  project_id: "deft-condition-404103",
  private_key_id: "d030580a86e2a02c1be8b6d317ffafb047f48c53",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCdnQnwjfVVxXNB\niNxuKUHdeGviCPyROzmmFc2fbeAx7H3gqDsFI+vxglIGT5dm258QNqdH/tDttuzu\nXG01lMtLb/uidd2l5CLyAf4kBenGF0QqrtLdDLbOECii3oCDXIOQgU3MrDwPWdP7\nrwCiXlMrimGQUW8/SMjYSGznT9HBoY9yiuCYHYgEB8U2m8OrK3bvBXQokMzWzCdo\nlnf6xbP61Wp6UzO0cEUSIoaAlc5secdNuDS71FS5AKtDF6cJ6AuJCPwC9zDvsYYe\nr3RL96ESeYHPPzG8fdheKv77N+5UFLmQ3BWcH8Bc6x+9J7HbFQ/cUCVIzQ710s4V\nJ3PXizOvAgMBAAECggEAKB1X8kmvL21ZsExNDhyiDuQfUSBIaA5S1dqmwvUMIqi2\nQP+QRfamjolEpyaKujsbeNzwJnrMYjQ0iVYs1X5RX5nYybiF+TrfSgkHzdNTdH9n\nchWcxXX+8ONb9Ff9DXH2akj+rCEKCD4sndokpy6qrGJEAp83WTwFIkcMsLK4CDfY\nLX001pWW0c2fqI4uxwf5wFqDyDonV5SZMx5lRzof+elXAiy0TKGbpR54rrmWIuBs\nE0jz0Rc3r+5qrCTF/2CRluJR/D8e79Akp1S4ais7Sm/oBhnCTWT2BEihRtS1UIeK\nsdakkfRaL2hdT/YYdC8yW3HVLNwBsKKXVBUZAcNSAQKBgQDM6iW0E+cxanekqtHd\noNqfcZIocCVSPG/B2KRhoic7cqMSeZBt7Z8cFGG60cvQXfxUW1TKp0n//s0lvvwZ\nY1FE8MJDoirG2vQ5KKTV5DWuktasDMaAY2x2IEbrDMb28v0GI6clu631suFF7nLh\n0MJyGFGfKVz2HfhlKq1ecWDaDwKBgQDE6BUVnvEBpOnbsYQLxu1/0Zz6ZZLmAqo6\neGC1I7WQ51UTrq+E7WcSiqySBLOSTvj7yqcUty38tLSGdYFOein57Q72xfQllcwW\nsxq1A6Jua9GzKnC0rQ/bp2GZKGzZ1M0fdA/hn/hMBLwuJ01sjVYTmHcWCwm4JIas\nV+4oM8IsYQKBgAbjXA8YmC3uEUWExHc5v/+aFrqrQmXoSC1w9d2eUMlLyjWFxpgb\nY7zS5pIcGUjQz/mZ9Fi3lOI5E3ZQXDMSRpoVqcISQnPayljdh+T0veU3ZGX2K/oG\n3Y9++ENQc6O7eUvqiOTY0TkwIShzooL6vH6PWLcL8ecIDOCBtcA1+XZ7AoGBAL6g\njKEE4gAcfwbgwZyBNraS4O2NXnztQY4fskhLTOD/BF9ss6H2D95kgJNQl+RiLivd\n0ol8mbnX3Bl8MvYd0PuTo/QGSsoETrP/KzDpVtyd50MUKE7SaNLXJeaXu2Hb4cW8\noA9nxoMZ5nCsPgmEfzuzVD7z6rHqMrMw4XDsQuShAoGBAMK6DGRbFWPg0J8QzCpN\nZc072aTG4cwCh360EWY2+TT6mzf7m2eeKw01Kh21yvMcHf8dYt+9CQQJEQCT99Ym\n+pd5dLd3JGNdkkM4/GZcM78xtsPWmX/uXZYMZSzXVB1XMXv0uKAcNyQS77rV+Zk5\npL5OXjyXQ5BWVOqh0+oFEZen\n-----END PRIVATE KEY-----\n",
  client_email:
    "credito-ya-testing@deft-condition-404103.iam.gserviceaccount.com",
  client_id: "116612103076331224021",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/credito-ya-testing%40deft-condition-404103.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Convierte el objeto JSON a una cadena
const jsonString = JSON.stringify(json_data);

// Tu contraseña
const password = "Elmahecha2003_";

// Encripta la cadena JSON
const encrypted = CryptoJS.AES.encrypt(jsonString, password).toString();

console.log("JSON encriptado:", encrypted);
