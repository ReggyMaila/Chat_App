import React from "react";

const rooms = ["global", "general", "random", "support"];

export default function RoomSelector({ currentRoom, setCurrentRoom }) {
  return (
    <div className="space-y-2">
      {rooms.map((r) => (
        <button
          key={r}
          onClick={() => setCurrentRoom(r)}
          className={`w-full text-left px-3 py-2 rounded ${currentRoom === r ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
