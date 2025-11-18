
import React, { useEffect, useRef } from "react";

function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessageList({ messages = [], currentUserId }) {
  const bottomRef = useRef();

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), [messages]);

  return (
    <div className="space-y-3">
      {messages.map((m) => {
        const mine = currentUserId && m.senderId === currentUserId;
        return (
          <div key={m._id || m.createdAt} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${mine ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"}`}>
              {!mine && <div className="text-xs text-gray-500 mb-1">{m.senderName || m.senderEmail}</div>}
              <div className="whitespace-pre-wrap">{m.content}</div>
              <div className="text-xs text-gray-400 mt-1 text-right">{formatTime(m.createdAt)}</div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
