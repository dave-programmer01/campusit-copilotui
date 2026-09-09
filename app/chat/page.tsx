import { Suspense } from "react";
import { Chat } from "@/components/chat";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#061513]" />}>
      <Chat />
    </Suspense>
  );
}
