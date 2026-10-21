import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

// The message thread for ONE conversation.
// It loads past messages over REST, then listens to the socket for
// new ones and lets you send messages in real time.
export default function MessageThread({ conversation, socket }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingName, setTypingName] = useState("");
  const bottomRef = useRef(null);

  const conversationId = conversation.id;

  // Load the conversation history from the server.
  const { data } = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => api.get(`/chat/conversations/${conversationId}/messages`),
  });

  // When history loads, put it into local state.
  useEffect(() => {
    if (data?.data) setMessages(data.data);
  }, [data]);

  // Join the conversation room and listen for live events.
  useEffect(() => {
    if (!socket) return;

    socket.emit("conversation:join", conversationId);

    function onNewMessage(message) {
      // Only add it if it belongs to the open conversation.
      if (message.conversation === conversationId) {
        setMessages((prev) => [...prev, message]);
      }
    }

    function onTyping({ name, isTyping }) {
      setTypingName(isTyping ? name : "");
    }

    socket.on("message:new", onNewMessage);
    socket.on("typing", onTyping);

    // Clean up listeners when we switch conversations.
    return () => {
      socket.emit("conversation:leave", conversationId);
      socket.off("message:new", onNewMessage);
      socket.off("typing", onTyping);
    };
  }, [socket, conversationId]);

  // Auto-scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingName]);

  function handleSend(e) {
    e.preventDefault();
    if (!text.trim() || !socket) return;
    // Send through the socket. The server saves it and broadcasts
    // it back (including to us), so we don't add it manually here.
    socket.emit("message:send", { conversationId, text });
    setText("");
    socket.emit("typing", { conversationId, isTyping: false });
  }

  // The other person in this chat (not me).
  const other =
    conversation.client.id === user.id
      ? conversation.freelancer
      : conversation.client;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-slate-200 p-4">
        <p className="font-semibold text-ink-900">{other.name}</p>
        <p className="text-xs text-ink-500">
          About: {conversation.job?.title || "a job"}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
        {messages.length === 0 && (
          <p className="text-center text-sm text-ink-500">
            No messages yet. Say hello!
          </p>
        )}

        {messages.map((m) => {
          const mine = m.sender.id === user.id;
          return (
            <div
              key={m.id}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                  mine
                    ? "rounded-br-sm bg-brand-500 text-white"
                    : "rounded-bl-sm border border-slate-200 bg-white text-ink-900"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {typingName && (
          <p className="text-xs italic text-ink-500">
            {typingName} is typing...
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSend}
        className="flex gap-2 border-t border-slate-200 p-3"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (socket) {
              socket.emit("typing", {
                conversationId,
                isTyping: e.target.value.length > 0,
              });
            }
          }}
          placeholder="Type a message..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <button
          type="submit"
          className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          Send
        </button>
      </form>
    </div>
  );
}
