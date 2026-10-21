import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useNotifications } from "./NotificationContext.jsx";
import MessageThread from "./MessageThread.jsx";

// The main chat page: a list of conversations on the left,
// the selected conversation's messages on the right.
export default function ChatPage() {
  const { user } = useAuth();
  // Reuse the one app-wide socket from NotificationContext.
  const { socket, clearForConversation } = useNotifications();
  const [searchParams] = useSearchParams();

  // The conversation currently open on the right.
  const [activeId, setActiveId] = useState(searchParams.get("c") || null);

  // When a conversation is open, clear its notifications.
  useEffect(() => {
    if (activeId) clearForConversation(activeId);
  }, [activeId, clearForConversation]);

  // Load all of my conversations.
  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/chat/conversations"),
  });

  const conversations = data?.data || [];

  // If the URL asked for a conversation, or we have none selected,
  // pick a sensible default once the list loads.
  useEffect(() => {
    if (!activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [conversations, activeId]);

  const active = conversations.find((c) => c.id === activeId);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-bold text-ink-900">Messages</h1>
      <p className="mt-1 text-sm text-ink-500">
        Chat with clients and freelancers in real time.
      </p>

      <div className="mt-6 grid h-[600px] gap-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card md:grid-cols-3">
        {/* Conversation list */}
        <div className="border-r border-slate-200 md:col-span-1">
          <div className="border-b border-slate-200 p-4 font-semibold text-ink-900">
            Conversations
          </div>

          {isLoading && <p className="p-4 text-sm text-ink-500">Loading...</p>}

          {data && conversations.length === 0 && (
            <p className="p-4 text-sm text-ink-500">
              No conversations yet. Start one from a job's proposals.
            </p>
          )}

          <div className="divide-y divide-slate-100 overflow-y-auto">
            {conversations.map((c) => {
              const other = c.client.id === user.id ? c.freelancer : c.client;
              const isActive = c.id === activeId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`block w-full p-4 text-left transition hover:bg-slate-50 ${
                    isActive ? "bg-brand-50" : ""
                  }`}
                >
                  <p className="font-medium text-ink-900">{other.name}</p>
                  <p className="truncate text-xs text-ink-500">
                    {c.job?.title || "a job"}
                  </p>
                  {c.lastMessage ? (
                    <p className="mt-1 truncate text-xs text-ink-500">
                      {c.lastMessage}
                    </p>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message thread */}
        <div className="md:col-span-2">
          {active ? (
            <MessageThread
              key={active.id}
              conversation={active}
              socket={socket}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-ink-500">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
