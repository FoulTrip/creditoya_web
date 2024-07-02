import qrcode

# URL que deseas convertir en código QR
texto = "https://creditoya.vercel.app/"

# Crear el código QR
codigo_qr = qrcode.make(texto)

# Guardar la imagen del código QR en un archivo
archivo_salida = "webCreditoYa_qr.png"
codigo_qr.save(archivo_salida)

print(f"Se ha generado el código QR en el archivo '{archivo_salida}'")
