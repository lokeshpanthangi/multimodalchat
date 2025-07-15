import { useState, useCallback } from "react";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { ChatInput } from "@/components/chat/ChatInput";
import { FileData } from "@/components/chat/FileUploadZone";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = useCallback((content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Clear files after sending message so they're associated with this question
    setFiles([]);
    
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question about the uploaded documents. Let me analyze them and provide you with a comprehensive answer.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  }, []);

  const handleFilesAdded = useCallback((newFiles: FileData[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate file processing
    newFiles.forEach(file => {
      setTimeout(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'processing' as const }
              : f
          )
        );
      }, 500);

      setTimeout(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id 
              ? { ...f, status: 'complete' as const }
              : f
          )
        );
        
        toast({
          title: "File processed",
          description: `${file.name} is ready for analysis`,
        });
      }, 2000);
    });
  }, [toast]);

  const handleFileRemove = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleClearFiles = useCallback(() => {
    setFiles([]);
    toast({
      title: "Files cleared",
      description: "All uploaded files have been removed",
    });
  }, [toast]);

  const handleUploadClick = useCallback(() => {
    const fileInput = document.getElementById('file-upload');
    fileInput?.click();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ChatHeader
        onClearFiles={handleClearFiles}
        hasFiles={files.length > 0}
      />
      
      <ChatContainer
        messages={messages}
        files={files}
        isTyping={isTyping}
        onUploadClick={handleUploadClick}
        className="flex-1"
      />
      
      <ChatInput
        onSendMessage={handleSendMessage}
        onFilesAdded={handleFilesAdded}
        onFileRemove={handleFileRemove}
        files={files}
        disabled={isTyping}
      />
    </div>
  );
};

export default Index;
