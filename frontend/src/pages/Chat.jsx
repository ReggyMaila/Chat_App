
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { createSocket } from "../utils/socket.js";
import Navbar from "../components /Navbar.jsx";
import MessageList from "../components /MessageList.jsx";
import MessageInput from "../components /MessageInput.jsx";
import RoomSelector from "../components /RoomSelector.jsx";
import OnlineUsers from "../components /OnlineUsers.jsx";

export default function Chat() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [socket, setSocket] = useState(null);
  const [currentRoom, setCurrentRoom] = useState("global");
  const [messages, setMessages] = useState([]);
  const [online, setOnline] = useState([]);

  useEffect(() => {
    (async () => {
      const token = await getToken({ template: "standard" }).catch(() => null);
      const s = createSocket({
        id: user?.id,
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        token: token ? `Bearer ${token}` : null,
      });

      setSocket(s);
      s.connect();

      s.on("connect", () => console.log("Socket connected:", s.id));
      s.on("new-message", (msg) => setMessages((prev) => [...prev, msg]));
      s.on("online-users", (users) => setOnline(users));
      s.emit("join-room", currentRoom);

      return () => {
        s.emit("leave-room", currentRoom);
        s.disconnect();
      };
    })();
  }, [user]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("join-room", currentRoom);
    return () => socket.emit("leave-room", currentRoom);
  }, [currentRoom]);

  const handleSend = (text) => {
    if (!text) return;
    socket.emit("send-message", { roomId: currentRoom, content: text });
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r p-4 bg-gray-50 overflow-auto">
          <h3 className="font-semibold mb-2">Rooms</h3>
          <RoomSelector currentRoom={currentRoom} setCurrentRoom={setCurrentRoom} />
          <h3 className="font-semibold mt-6">Online</h3>
          <OnlineUsers users={online} />
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 overflow-auto">
            <MessageList messages={messages} currentUserId={user?.id} />
          </div>
          <div className="p-2 bg-white">
            <MessageInput onSend={handleSend} />
          </div>
        </main>
      </div>
    </div>
  );
}


