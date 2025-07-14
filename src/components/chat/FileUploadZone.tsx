import { useCallback, useState } from "react";
import { Cloud, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
  progress?: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

interface FileUploadZoneProps {
  onFilesAdded: (files: FileData[]) => void;
  onFileRemove: (id: string) => void;
  files: FileData[];
  className?: string;
}

export const FileUploadZone = ({ 
  onFilesAdded, 
  onFileRemove, 
  files, 
  className 
}: FileUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
      }
      return newCount;
    });
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragCounter(0);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const processFiles = (fileList: File[]) => {
    const newFiles: FileData[] = fileList.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      status: 'uploading' as const
    }));

    onFilesAdded(newFiles);
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
    e.target.value = '';
  }, []);

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

  return (
    <div className={cn("relative", className)}>
      {/* Drag overlay */}
      {isDragging && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="bg-card border-2 border-dashed border-primary rounded-lg p-12 text-center animate-fade-in">
            <Cloud className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-medium text-foreground mb-2">Drop your documents here</h3>
            <p className="text-muted-foreground">
              Supports PDF, DOCX, XLSX, PPTX, images, and text files
            </p>
          </div>
        </div>
      )}

      {/* File input */}
      <input
        type="file"
        id="file-upload"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => document.getElementById('file-upload')?.click()}
        className="rounded-full h-10 w-10 p-0"
      >
        <Upload className="h-4 w-4" />
      </Button>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-chat-file-card border border-chat-file-border rounded-lg p-3 flex items-center justify-between animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{getFileIcon(file.type)}</span>
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
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    Processing
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce-dots"></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce-dots" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-primary rounded-full animate-bounce-dots" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
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
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};