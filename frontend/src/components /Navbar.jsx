
import React from "react";
import { UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow">
      <h1 className="text-lg font-bold">Chat App</h1>
      <UserButton />
    </div>
  );
}

