import React from "react";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import Chat from "../src/pages/Chat.jsx";

export default function App() {
  return (
    <>
      <SignedIn>
        <Chat />
      </SignedIn>

      <SignedOut>
        <div className="flex items-center justify-center h-screen">
          <div className="p-6 bg-white rounded shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Please sign in to use the chat
            </h2>
            <SignIn />
          </div>
        </div>
      </SignedOut>
    </>
  );
}


