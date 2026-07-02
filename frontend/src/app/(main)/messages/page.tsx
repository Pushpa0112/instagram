"use client";

import { useEffect } from "react";
import { useMessageStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";
import { initSocket, disconnectSocket } from "@/lib/socket";
import { ThreadView } from "@/features/message/ThreadView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/types/api";

export default function MessagesPage() {
  const authUser = useAuthStore((state) => state.user);
  const { activeUserId, setActiveUserId, knownPartners } = useMessageStore();
  const queryClient = useQueryClient();

  // Socket Connection & Listeners
  useEffect(() => {
    if (!authUser) return;

    const socket = initSocket(authUser._id);

    socket.on("newMessage", (message: Message) => {
      // Find the chat partner (the other person in the thread)
      const chatPartnerId = message.senderId === authUser._id ? message.receiverId : message.senderId;
      
      queryClient.setQueryData(["messages", chatPartnerId], (old: Message[] = []) => {
        if (old.some(m => m._id === message._id)) return old;
        return [...old, message];
      });
    });

    return () => {
      socket.off("newMessage");
      disconnectSocket();
    };
  }, [authUser, queryClient]);

  const activePartner = knownPartners.find(p => p._id === activeUserId);

  return (
    <div className="flex h-screen bg-white dark:bg-black w-full pt-[60px] md:pt-0 border-l border-gray-200 dark:border-zinc-800">
      {/* Left Pane: Conversation List */}
      <div className={`w-full md:w-[350px] flex-col border-r border-gray-200 dark:border-zinc-800 ${activeUserId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 h-[60px] shrink-0">
          <h2 className="font-bold text-xl">{authUser?.username}</h2>
          <Edit className="w-6 h-6 cursor-pointer" />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-between items-center px-4 py-2 mt-2">
            <span className="font-semibold">Messages</span>
            <span className="text-gray-500 font-semibold text-sm">Requests</span>
          </div>

          {knownPartners.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              <p>No conversations yet.</p>
              {/* Note: This is flagged as a placeholder until a true GET /conversations exists. */}
              <p className="text-xs mt-2">Try messaging someone from their profile!</p>
            </div>
          ) : (
            knownPartners.map((partner) => (
              <div 
                key={partner._id} 
                onClick={() => setActiveUserId(partner._id)}
                className={`flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-900 ${activeUserId === partner._id ? 'bg-gray-100 dark:bg-zinc-800' : ''}`}
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={partner.profilePicture || ""} />
                  <AvatarFallback className="uppercase">{partner.username[0]}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold">{partner.username}</span>
                  <span className="text-sm text-gray-500">Active recently</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Pane: Thread View */}
      <div className={`flex-1 ${!activeUserId ? 'hidden md:flex' : 'flex'}`}>
        {activePartner ? (
          <ThreadView partner={activePartner} />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full text-center p-8">
            <div className="w-24 h-24 border-2 border-black dark:border-white rounded-full flex items-center justify-center mb-4">
              <Edit className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your Messages</h2>
            <p className="text-gray-500 mb-6">Send private photos and messages to a friend or group.</p>
            <button className="bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold py-2 px-4 rounded-lg">
              Send Message
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
