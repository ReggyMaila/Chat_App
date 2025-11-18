import React from "react";

export default function OnlineUsers({ users }) {
  if (!users || users.length === 0) return <div className="text-sm text-gray-500">No one online</div>;
  return (
    <div className="space-y-2">
      {users.map((u) => (
        <div key={u.id || u.email} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-medium">
            {u.name ? u.name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="text-sm font-semibold">{u.name || u.email}</div>
            <div className="text-xs text-gray-500">{u.email}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

