import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Resources = () => {
  const [resources, setResources] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        variant: "destructive",
      });
      return;
    }

    setResources(data || []);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div>
          <h2 className="text-2xl font-bold mb-4">Knowledge Base</h2>
          <div className="space-y-4">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white p-4 rounded-lg shadow"
              >
                <h3 className="font-semibold">{resource.title}</h3>
                {resource.category && (
                  <p className="text-sm text-gray-500">{resource.category}</p>
                )}
                <p className="mt-2">{resource.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Resources;