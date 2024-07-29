import React from "react";
import { io, Socket } from "socket.io-client";

const storedToken = localStorage.getItem("z");
let accessToken = "";

if (storedToken) {
  try {
    const parsedToken = JSON.parse(storedToken);
    accessToken = parsedToken?.state?.accessToken?.token || "";
  } catch (error) {
    console.error("Failed to parse token:", error);
  }
}

export const socket = io("https://api2.winme.life", {
  auth: {
    token: `Bearer ${accessToken}`,
  },
});

// Define the context with a default value
export const SocketContext = React.createContext<Socket | null>(null);
