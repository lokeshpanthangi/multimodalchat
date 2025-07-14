import { useState, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send, Pin, ChevronUp } from "lucide-react";
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
  const [showFiles, setShowFiles] = useState(false);
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

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const newFiles: FileData[] = selectedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'uploading' as const
    }));
    onFilesAdded(newFiles);
    e.target.value = '';
  }, [onFilesAdded]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word') || type.includes('doc')) return '📝';
    if (type.includes('excel') || type.includes('sheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📋';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📄';
    return '📎';
  };

  const canSend = message.trim().length > 0 && !disabled;

  return (
    <div className={cn("border-t border-border px-6 py-4", className)}>
      <form onSubmit={handleSubmit} className="w-full mx-auto">
        <div className="relative flex items-end gap-3">
          {/* Text input with pin button inside */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask about your documents or drag files to upload..."
              disabled={disabled}
              className="w-full min-h-[2.5rem] max-h-24 px-10 py-3 pr-12 rounded-[20px] border border-input bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              style={{ lineHeight: '1.5rem' }}
            />
            
            {/* Pin button (upload) */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => document.getElementById('file-upload')?.click()}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/50"
            >
              <Pin className="h-4 w-4" />
            </Button>

            {/* Files dropdown button */}
            {files.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFiles(!showFiles)}
                className="absolute left-10 top-1/2 -translate-y-1/2 h-8 px-2 hover:bg-muted/50 text-xs"
              >
                {files.length} file{files.length > 1 ? 's' : ''}
                <ChevronUp className={cn("h-3 w-3 ml-1 transition-transform", showFiles ? "rotate-180" : "")} />
              </Button>
            )}
            
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

        {/* Hidden file input */}
        <input
          type="file"
          id="file-upload"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Files dropdown */}
        {files.length > 0 && showFiles && (
          <div className="mt-2 p-2 bg-muted/30 rounded-lg border border-border">
            <div className="space-y-1">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-2 bg-background rounded border"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getFileIcon(file.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    {file.status === 'uploading' && (
                      <div className="text-xs text-muted-foreground">Uploading...</div>
                    )}
                    {file.status === 'processing' && (
                      <div className="text-xs text-muted-foreground">Processing...</div>
                    )}
                    {file.status === 'complete' && (
                      <div className="text-xs text-green-600">Ready</div>
                    )}
                    {file.status === 'error' && (
                      <div className="text-xs text-destructive">Error</div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemove(file.id)}
                    className="h-6 w-6 p-0 hover:bg-destructive/20"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};