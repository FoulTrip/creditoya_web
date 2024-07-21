![Logo Credito Ya](https://res.cloudinary.com/dvquomppa/image/upload/v1717654334/credito_ya/cirm9vbdngqyxymcpfad.png)


## Web application for customers
I developed an innovative full stack web application solution that transformed the loan application process into a 100% digital experience. The customer application allows the registration and upload of data required to apply for a loan, with a real-time interface to track the status of the application. The employee application facilitates loan management and approval, displaying applications in real time and streamlining workflow. This integrated system has not only simplified the process, but also improved efficiency and transparency in loan approval.

## Requisitos Previos
- Node.js (versión 20 o superior)
- MongoDB (versión 4.4 o superior)
- Prisma CLI

## Tecnologías
La aplicación está creada con las siguientes tecnologías:
- React.js
- TypeScript
- Next.js [app Router v13]
- MongoDB
- Prisma CLI

## Configuración

primero clona el repositorio desde tu terminal
```bash
git clone https://github.com/TripCodeTeam/creditoya_web.git
```
Ingresa a la carpeta
```bash 
cd creditoya_web
```
Instalacion de dependencias
```bash 
npm install
```

## Configuración del Entorno
Crear un archivo .env en la raíz del proyecto con el contenido del archivo ```.env.test```

## Generar cliente de prisma
```bash
npx prisma generate --schema=./src/prisma/schema.prisma
```

## Ejecucion
```bash 
npm run dev
```