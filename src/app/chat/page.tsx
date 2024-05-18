"use client";

import socket from "@/Socket/Socket";
import React, { useEffect, useState } from "react";

function ChatComponent() {
  const [inputText, setInputText] = useState<string | null>(null);
  const [messageSend, setMessageSend] = useState<string | null>(null);

  useEffect(() => {
    socket.on("textUpdate", (data) => {
      const { text } = data;
      setMessageSend(text);
    });

    return () => {
      socket.off("textUpdate");
    };
  }, []);

  const handleSendMessage = () => {
    const data = {
      text: inputText,
    };

    socket.emit("send_text_test", data);
  };

  return (
    <>
      <p style={{marginTop: "7em"}}>Private Message</p>
      <input type="text" onChange={(e) => setInputText(e.target.value)} />
      <button onClick={handleSendMessage}>Enviar</button>

      <p>mensaje Enviado</p>
      {messageSend == null ? "Sin mensajes enviados" : messageSend}
    </>
  );
}

export default ChatComponent;
