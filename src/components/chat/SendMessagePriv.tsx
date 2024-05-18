import socket from "@/lib/socket/socket";
import React, { FormEvent, useState } from "react";

function SendMessagePriv({ userId }: { userId: string }) {
  const [inputText, setInputText] = useState<string | null>(null);

  const handleSendMessage = () => {
    const data = {
      text: inputText,
    };

    socket.emit("send_text_test", data);
  };

  return (
    <>
      <p>Private Message</p>
      <input type="text" onChange={(e) => setInputText(e.target.value)} />
      <button onClick={handleSendMessage}>Enviar</button>
    </>
  );
}

export default SendMessagePriv;
