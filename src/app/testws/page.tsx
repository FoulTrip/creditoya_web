"use client";

import { useWebSocket } from "@/Socket/SocketHook";
import React, { FormEvent, useRef, useState } from "react";

function TestMessage() {
  const [text, setText] = useState<string | null>(null);
  const [userGenerate, setUserGenerate] = useState<string | null>(null);

  const handleOnMessage = (event: any) => {
    const message = JSON.parse(event.data);
    console.log("Mensaje del servidor: ", event.data);

    switch (message.type) {
      case "newUserCreate":
        console.log(message.newUser);
        setUserGenerate(message.newUser);
        break;
    }
  };

  const { send } = useWebSocket({
    url: process.env.NEXT_PUBLIC_ENDPOINT_WEBSOCKET as string,
    onMessage: handleOnMessage,
  });

  //   useEffect(() => {
  //     const connect = () => {
  //       socketRef.current = new WebSocket(
  //         process.env.NEXT_PUBLIC_ENDPOINT_WEBSOCKET as string
  //       );

  //       socketRef.current.addEventListener("open", (event) => {
  //         console.log("Conexion abierta", event);
  //       });

  //       socketRef.current.addEventListener("message", handleOnMessage);

  //       socketRef.current.addEventListener("error", (event) => {
  //         console.log("Error: ", event);
  //         setTimeout(connect, 5000);
  //       });
  //     };

  //     connect();

  //     return () => {
  //       if (socketRef.current) {
  //         socketRef.current.close();
  //       }
  //     };
  //   }, [socketRef]);

  const handlerSubmit = (e: FormEvent) => {
    e.preventDefault();
    send("messageTest", text);
  };

  return (
    <>
      <p style={{ marginTop: "7em" }}>Crea un nuevo username</p>
      <input type="text" onChange={(e) => setText(e.target.value)} />
      <button onClick={handlerSubmit}>Generar</button>

      {userGenerate && userGenerate}
    </>
  );
}

export default TestMessage;
