
import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const DocumentUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const fileType = file.name.toLowerCase();
    if (!fileType.endsWith('.pdf') && !fileType.endsWith('.docx')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF or Word document",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data: { url } } = await supabase.functions.invoke('generate-embedding', {
        body: formData,
      });

      toast({
        title: "Document uploaded successfully",
        description: "The document has been processed and added to the chatbot's knowledge base.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-[#FF8A48]" />
        <h3 className="text-sm font-medium text-[#1A1F2C]">Train Your Chatbot</h3>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        Upload PDF or Word documents to enhance your chatbot's knowledge. The content will be processed and used to provide more informed responses.
      </p>

      <div className="relative">
        <input
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        <button
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 border border-dashed border-gray-300 rounded-lg text-sm ${
            isUploading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-50'
          }`}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Processing...' : 'Upload Document'}
        </button>
      </div>
    </div>
  );
};

export default DocumentUpload;
