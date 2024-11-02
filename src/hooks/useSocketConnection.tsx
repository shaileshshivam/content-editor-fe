import { useMemo, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  API_HOST,
  ID_KEY,
  RECONNECTION_ATTEMPTS,
  RECONNECTION_DELAY,
} from "../constants";
import { io } from "socket.io-client";
import { EditorAction } from "../types";

const createSocket = () => {
  const socket = io(API_HOST, {
    autoConnect: false,
    reconnectionAttempts: RECONNECTION_ATTEMPTS,
    reconnectionDelay: RECONNECTION_DELAY,
    timeout: 10000,
  });
  return socket;
};

const useSocketConnection = (dispatch: React.Dispatch<EditorAction>) => {
  const socket = useMemo(() => createSocket(), []);
  const userId = useMemo(() => {
    const prevId = localStorage.getItem(ID_KEY);
    const newId = prevId || uuidv4();
    localStorage.setItem(ID_KEY, newId);
    return newId;
  }, []);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      dispatch({ type: "SET_SOCKET_CONNECTED", payload: true });
      socket.emit("user:add", { clientId: userId });
    });

    socket.on("disconnect", () => {
      dispatch({ type: "SET_SOCKET_CONNECTED", payload: false });
    });

    socket.on("connect_error", () => {
      dispatch({
        type: "SET_ERROR",
        payload: "Connection failed. Retrying...",
      });
      dispatch({ type: "SET_SOCKET_CONNECTED", payload: false });
    });

    socket.on("document:update", ({ doc }) => {
      dispatch({ type: "UPDATE_DOCUMENT", payload: doc });
    });

    socket.on("editor:lock-status", (locks) => {
      dispatch({ type: "SET_DOCUMENT_LOCKS", payload: locks });
    });

    socket.on("document:active-editors", (documentUsers) => {
      dispatch({ type: "SET_ACTIVE_EDITORS", payload: documentUsers });
    });

    socket.onAny((event, ...args) => {
      console.log({ event, args });
    });

    return () => {
      socket.emit("user:remove", { clientId: userId });
      socket.disconnect();
    };
  }, [socket, dispatch, userId]);

  return { socket, userId };
};

export { useSocketConnection };
