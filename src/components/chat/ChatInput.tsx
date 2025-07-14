import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUploadZone, FileData } from "./FileUploadZone";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFilesAdded: (files: FileData[]) => void;
  onFileRemove: (id: string) => void;
  files: FileData[];
  disabled?: boolean;
  className?: string;
}

export const ChatInput = ({
  onSendMessage,
  onFilesAdded,
  onFileRemove,
  files,
  disabled = false,
  className
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  }, [message, disabled, onSendMessage]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 4 * 24; // 4 lines * 24px line height
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  }, []);

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className={cn("border-t border-border bg-card px-6 py-4", className)}>
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-3">
          {/* File upload zone */}
          <FileUploadZone
            onFilesAdded={onFilesAdded}
            onFileRemove={onFileRemove}
            files={files}
            className="flex-shrink-0"
          />

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your documents or drag files to upload..."
              disabled={disabled}
              className="w-full min-h-[2.5rem] max-h-24 px-4 py-3 pr-12 rounded-[20px] border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              style={{ lineHeight: '1.5rem' }}
            />
            
            {/* Send button */}
            <Button
              type="submit"
              disabled={!canSend}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 p-0 rounded-full transition-all duration-200",
                canSend
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};