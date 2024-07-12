"use client";

import { WebSocketProvider } from "next-ws/client";

export function WsProvider({ children }: { children: React.ReactNode }) {
  return (
    <WebSocketProvider url={`${process.env.NEXT_PUBLIC_ENDPOINT_WS}`}>
      {children}
    </WebSocketProvider>
  );
}
