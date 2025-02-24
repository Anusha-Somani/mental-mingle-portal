
import { useState, useEffect } from "react";
import { Trash2, FileText, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Document = {
  id: string;
  content: string;
  category: string | null;
  created_at: string;
};

const DocumentManager = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_document_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error loading documents",
        description: "There was a problem loading the documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase
        .from('embeddings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDocuments(documents.filter(doc => doc.id !== id));
      toast({
        title: "Document deleted",
        description: "The document has been removed from the chatbot's knowledge base.",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error deleting document",
        description: "There was a problem deleting the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-[#FF8A48]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#1A1F2C]">Manage Documents</h3>
        <span className="text-sm text-gray-500">{documents.length} documents</span>
      </div>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#FF8A48]" />
                  <CardTitle className="text-base">{doc.category || 'Uncategorized'}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  disabled={deleting === doc.id}
                >
                  {deleting === doc.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </div>
              <CardDescription className="text-xs">
                Added {new Date(doc.created_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">{doc.content}</p>
            </CardContent>
          </Card>
        ))}
        
        {documents.length === 0 && (
          <div className="text-center p-8 border border-dashed rounded-lg">
            <p className="text-gray-500">No documents have been uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentManager;
