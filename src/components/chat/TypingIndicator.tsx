export const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-chat-ai text-foreground border border-chat-file-border rounded-[18px] px-4 py-3 shadow-sm max-w-[80%]">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">AI is thinking</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce-dots"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce-dots" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce-dots" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};