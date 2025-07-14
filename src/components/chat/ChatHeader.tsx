import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onClearFiles?: () => void;
  hasFiles?: boolean;
}

export const ChatHeader = ({ onClearFiles, hasFiles }: ChatHeaderProps) => {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-foreground">DocuChat</h1>
      </div>
      
      <div className="flex items-center gap-4">
        {hasFiles && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFiles}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Files
          </Button>
        )}
        
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg" alt="User" />
          <AvatarFallback className="bg-primary text-primary-foreground">
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};