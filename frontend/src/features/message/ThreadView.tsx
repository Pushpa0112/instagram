"use client";

import { useEffect, useRef, useState } from "react";
import { useMessages, useSendMessage } from "./hooks";
import { MessageBubble } from "./MessageBubble";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "@/types/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Info, Image as ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function ThreadView({ partner }: { partner: User }) {
  const { data: messages, isLoading } = useMessages(partner._id);
  const { mutate: sendMessage, isPending } = useSendMessage(partner._id);
  const authUser = useAuthStore((state) => state.user);
  
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isPending) return;
    sendMessage(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 h-[60px] shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={partner.profilePicture || ""} />
            <AvatarFallback>{partner.username[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{partner.username}</span>
        </div>
        <Info className="w-6 h-6 cursor-pointer" />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col">
        {isLoading ? (
          <div className="space-y-4">
            <div className="flex justify-start"><Skeleton className="h-10 w-48 rounded-2xl rounded-bl-sm" /></div>
            <div className="flex justify-end"><Skeleton className="h-10 w-32 rounded-2xl rounded-br-sm" /></div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={partner.profilePicture || ""} />
              <AvatarFallback className="text-4xl uppercase">{partner.username[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-xl font-bold text-black dark:text-white">{partner.username}</h2>
              <p className="text-sm mt-1">Instagram</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col mt-auto">
            {messages?.map((msg) => (
              <MessageBubble 
                key={msg._id} 
                message={msg} 
                isOwn={msg.senderId === authUser?._id || msg.senderId === 'me'} 
              />
            ))}
            {/* 
              FEATURE_FLAG_TYPING: 
              Backend does not currently emit a "typing" event via socket.js. 
              Stubbing here for future implementation.
            */}
            {/* {isTyping && <div className="text-xs text-gray-500 mb-4">{partner.username} is typing...</div>} */}
            <div ref={endRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 m-4 border border-gray-200 dark:border-zinc-800 rounded-full flex items-center gap-3 shrink-0">
        <form onSubmit={handleSend} className="flex-1 flex items-center w-full">
          <input 
            type="text" 
            placeholder="Message..." 
            className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {text.trim() ? (
            <button 
              type="submit" 
              className="text-[#0095F6] font-semibold text-sm hover:text-[#1877F2]"
              disabled={isPending}
            >
              Send
            </button>
          ) : (
            <ImageIcon className="w-6 h-6 cursor-pointer" />
          )}
        </form>
      </div>
    </div>
  );
}
