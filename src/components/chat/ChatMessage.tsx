import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ChatMessageProps {
  content: string | ReactNode;
  isUser: boolean;
  timestamp?: Date;
  className?: string;
}

export const ChatMessage = ({ 
  content, 
  isUser, 
  timestamp, 
  className 
}: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-slide-up",
        isUser ? "justify-end" : "justify-start",
        className
      )}
    >
      <div
        className={cn(
          "max-w-[70%] rounded-[18px] px-4 py-3 shadow-sm",
          isUser
            ? "bg-chat-user text-primary-foreground ml-auto"
            : "bg-chat-ai text-foreground border border-chat-file-border max-w-[80%]"
        )}
      >
        <div className="text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
        {timestamp && (
          <div
            className={cn(
              "text-xs mt-2 opacity-70",
              isUser ? "text-primary-foreground" : "text-muted-foreground"
            )}
          >
            {timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        )}
      </div>
    </div>
  );
};