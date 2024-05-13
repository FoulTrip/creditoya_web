// import { io } from "socket.io-client";

// const socket = io("http://localhost:4000/", {});

// export default socket

const socket = new WebSocket("http://127.0.0.1:8787");

socket.addEventListener("open", (event) => {
  console.log("Conexion abierta");
  socket.send("Hello Server");
});
