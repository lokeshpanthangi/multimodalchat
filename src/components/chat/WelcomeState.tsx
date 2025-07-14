import { FileText, Camera, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-documents.png";

interface WelcomeStateProps {
  onUploadClick: () => void;
}

export const WelcomeState = ({ onUploadClick }: WelcomeStateProps) => {
  const suggestions = [
    {
      icon: FileText,
      text: "Upload a PDF",
      action: onUploadClick
    },
    {
      icon: Camera,
      text: "Try with images",
      action: onUploadClick
    },
    {
      icon: BarChart3,
      text: "Analyze spreadsheets",
      action: onUploadClick
    }
  ];

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        {/* Hero image */}
        <div className="mb-8">
          <img 
            src={heroImage} 
            alt="Document processing illustration" 
            className="w-32 h-32 mx-auto rounded-lg shadow-soft"
          />
        </div>

        {/* Welcome message */}
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Upload documents and start asking questions
        </h2>
        <p className="text-muted-foreground mb-8">
          Supports PDF, Word, Excel, PowerPoint, and images
        </p>


        {/* Upload hint */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-dashed border-muted">
          <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">
            Drag files here or click to upload
          </p>
        </div>
      </div>
    </div>
  );
};