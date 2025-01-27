import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Resources = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from("knowledge_base").insert([
      {
        title,
        content,
        category,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add resource",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Resource added successfully",
    });

    setTitle("");
    setContent("");
    setCategory("");
    fetchResources();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold">Add Knowledge Base Resource</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </div>
              <div>
                <Textarea
                  placeholder="Content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="h-32"
                />
              </div>
              <Button type="submit">Add Resource</Button>
            </form>
          </div>

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
        </div>
      </main>
    </div>
  );
};

export default Resources;