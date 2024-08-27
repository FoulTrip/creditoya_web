export const generateMailNewYear = ({
  completeName,
}: {
  completeName: string;
}) => {
  return `
        <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Creación de Préstamo</title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap");
          * {
            margin: 0;
            font-family: "Roboto", sans-serif;
            font-weight: 400;
            font-style: normal;
          }
        </style>
      </head>
      <body>
        <main>
          <div style="justify-content: flex-start">
            <img
              style="width: 200px; height: auto"
              src="https://res.cloudinary.com/dvquomppa/image/upload/v1717654334/credito_ya/cirm9vbdngqyxymcpfad.png"
            />
          </div>
          <p style="margin-top: 1em">
            Estimado ${completeName}
          </p>
  
          <p style="margin-top: 7px">En esta temporada tan especial, todo el equipo de Credito Ya quiere desearte una muy Feliz Navidad y un próspero Año Nuevo. Agradecemos sinceramente tu confianza y apoyo durante el año. Que estas fiestas te brinden alegría, paz y éxito en el año que comienza.</p>

          <p style="margin-top: 7px">¡Felices fiestas!</p>
    
          <h5 style="margin-top: 2em; color: #6c6c6c">Atentamente,</h5>
          <h4>Equipo de Credito Ya</h4>
        </main>
      </body>
    </html>
        `;
};
