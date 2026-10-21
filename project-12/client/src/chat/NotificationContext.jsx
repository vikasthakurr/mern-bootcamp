import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext.jsx";

const SOCKET_URL = "http://localhost:4000";

// This context owns ONE socket connection for the whole app and
// collects chat notifications. The bell icon reads from here, and
// the chat page reuses the same socket.
const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // A list of unread notifications: { conversationId, from, text, createdAt }.
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect when logged in. Disconnect on logout.
    if (!isLoggedIn) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      setNotifications([]);
      return;
    }

    const token = localStorage.getItem("talentbridge:token");
    const s = io(SOCKET_URL, { auth: { token } });
    socketRef.current = s;
    setSocket(s);

    // Every incoming notification is added to the top of the list.
    s.on("notification:new", (note) => {
      setNotifications((prev) => [note, ...prev]);
    });

    return () => {
      s.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn]);

  // Remove notifications for a conversation once the user opens it.
  function clearForConversation(conversationId) {
    setNotifications((prev) =>
      prev.filter((n) => n.conversationId !== conversationId)
    );
  }

  function clearAll() {
    setNotifications([]);
  }

  const value = {
    socket,
    notifications,
    unreadCount: notifications.length,
    clearForConversation,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used inside a <NotificationProvider>"
    );
  }
  return context;
}
