import { useState, useEffect, useRef, useCallback } from "react";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import { WelcomeState } from "./WelcomeState";
import { FileData } from "./FileUploadZone";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  messages: Message[];
  files: FileData[];
  isTyping: boolean;
  onUploadClick: () => void;
  className?: string;
}

export const ChatContainer = ({
  messages,
  files,
  isTyping,
  onUploadClick,
  className
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const isEmpty = messages.length === 0 && files.length === 0;

  return (
    <div
      ref={containerRef}
      className={`flex-1 overflow-y-auto bg-chat-bg ${className}`}
    >
      {isEmpty ? (
        <WelcomeState onUploadClick={onUploadClick} />
      ) : (
        <div className="w-full px-6 py-6">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};