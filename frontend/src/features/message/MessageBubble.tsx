import { Message } from "@/types/api";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex w-full ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
      <div 
        className={`max-w-[70%] px-4 py-2 rounded-2xl ${
          isOwn 
            ? 'bg-[#0095F6] text-white rounded-br-sm' 
            : 'bg-gray-200 dark:bg-zinc-800 text-black dark:text-white rounded-bl-sm'
        }`}
      >
        <p className="text-sm">{message.message}</p>
      </div>
    </div>
  );
}
