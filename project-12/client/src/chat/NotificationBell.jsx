import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./NotificationContext.jsx";
import { BellIcon } from "../components/Icons.jsx";

// A bell icon in the navbar. Shows a red count badge when there are
// unread message notifications, and a dropdown listing them.
// Clicking a notification opens that conversation.
export default function NotificationBell() {
  const { notifications, unreadCount, clearForConversation, clearAll } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Open the chat for a notification, then remove it from the list.
  function openChat(conversationId) {
    clearForConversation(conversationId);
    setOpen(false);
    navigate(`/messages?c=${conversationId}`);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-700 transition hover:bg-slate-100 hover:text-brand-500"
        title="Notifications"
      >
        <BellIcon />
        {/* Red count badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-hover">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <p className="text-sm font-semibold text-ink-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-medium text-brand-500 hover:text-brand-600"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center text-sm text-ink-500">
                No new messages.
              </p>
            ) : (
              notifications.map((n, i) => (
                <button
                  key={i}
                  onClick={() => openChat(n.conversationId)}
                  className="block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50"
                >
                  <p className="text-sm font-medium text-ink-900">
                    New message from {n.from}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink-500">
                    {n.text}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
