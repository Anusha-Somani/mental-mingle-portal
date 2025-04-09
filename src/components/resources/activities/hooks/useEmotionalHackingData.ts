
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  EmotionalHackingData, 
  EmotionalHackingDataInsert,
  asEmotionalHackingData 
} from "../types/emotionalHackingData";

const useEmotionalHackingData = (userId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<EmotionalHackingData | null>(null);
  const { toast } = useToast();

  // Fetch user's emotional hacking data
  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Using type assertion to bypass TypeScript's type checking for Supabase tables
      const { data: emotionalHackingData, error } = await supabase
        .from('emotional_hacking_data' as any)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Record not found, create a new one
          return await createInitialData();
        } else {
          console.error("Error fetching emotional hacking data:", error);
          setError(error.message);
          toast({
            title: "Error",
            description: "Failed to load your data. Please try again later.",
            variant: "destructive",
          });
        }
      } else if (emotionalHackingData) {
        // Convert the data to our defined type
        const typedData = asEmotionalHackingData(emotionalHackingData);
        setData({
          ...typedData,
          journal_entries: typedData.journal_entries || [],
          completed_exercises: typedData.completed_exercises || [],
          favorite_exercises: typedData.favorite_exercises || []
        });
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create initial data record for a new user
  const createInitialData = async () => {
    try {
      const newData: EmotionalHackingDataInsert = {
        user_id: userId!,
        journal_entries: [],
        completed_exercises: [],
        favorite_exercises: [],
      };

      // Using type assertion to bypass TypeScript's type checking for Supabase tables
      const { data: createdData, error } = await supabase
        .from('emotional_hacking_data' as any)
        .insert(newData)
        .select()
        .single();

      if (error) {
        console.error("Error creating initial data:", error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to initialize your data. Please try again later.",
          variant: "destructive",
        });
      } else if (createdData) {
        // Convert the data to our defined type
        const typedData = asEmotionalHackingData(createdData);
        setData(typedData);
      }
    } catch (err) {
      console.error("Unexpected error creating data:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  // Update the emotional hacking data
  const updateData = async (
    field: keyof EmotionalHackingData,
    value: string[]
  ) => {
    if (!userId || !data) return;

    setLoading(true);
    try {
      const updatePayload = {
        [field]: value,
        updated_at: new Date().toISOString(),
      };

      // Using type assertion to bypass TypeScript's type checking for Supabase tables
      const { error } = await supabase
        .from('emotional_hacking_data' as any)
        .update(updatePayload)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error updating ${field}:`, error);
        setError(error.message);
        toast({
          title: "Error",
          description: `Failed to update your ${field}. Please try again later.`,
          variant: "destructive",
        });
      } else {
        // Update local state
        setData({
          ...data,
          [field]: value,
          updated_at: new Date().toISOString(),
        });
        toast({
          title: "Success",
          description: `Your ${field.replace(/_/g, " ")} have been updated.`,
        });
      }
    } catch (err) {
      console.error("Unexpected error updating data:", err);
      setError("An unexpected error occurred");
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    data,
    loading,
    error,
    updateData,
    refreshData: fetchData,
  };
};

export default useEmotionalHackingData;
