
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

interface EmotionalAwarenessActivityProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

interface EmotionalAwarenessFormValues {
  location: string;
  appearance: string;
  intensity: string;
  volume: string;
  message: string;
}

// Define a type for our database response
interface EmotionalAwarenessEntry {
  id: string;
  user_id: string;
  module_id: number;
  location: string;
  appearance: string;
  intensity: string;
  volume: string;
  message: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

const EmotionalAwarenessActivity: React.FC<EmotionalAwarenessActivityProps> = ({
  isOpen,
  onClose,
  userId
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<EmotionalAwarenessFormValues>({
    defaultValues: {
      location: "",
      appearance: "",
      intensity: "",
      volume: "",
      message: ""
    }
  });

  // Load existing data if available
  useEffect(() => {
    const loadExistingData = async () => {
      if (!userId || !isOpen) return;
      
      try {
        // Use a generic type parameter with the custom interface
        const { data, error } = await supabase
          .from('emotional_awareness_entries')
          .select('*')
          .eq('user_id', userId)
          .eq('module_id', 201) // Emotion Awareness module ID
          .single();
          
        if (error) {
          console.error("Error loading data:", error);
          return;
        }
        
        if (data) {
          // Cast data to our custom type
          const entry = data as EmotionalAwarenessEntry;
          form.reset({
            location: entry.location || "",
            appearance: entry.appearance || "",
            intensity: entry.intensity || "",
            volume: entry.volume || "",
            message: entry.message || ""
          });
        }
      } catch (error) {
        console.error("Failed to load existing data:", error);
      }
    };
    
    loadExistingData();
  }, [userId, isOpen, form]);
  
  const onSubmit = async (values: EmotionalAwarenessFormValues) => {
    if (!userId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your responses",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save responses to Supabase using a generic type
      const { error } = await supabase
        .from('emotional_awareness_entries')
        .upsert({
          user_id: userId,
          module_id: 201, // Emotion Awareness module ID
          location: values.location,
          appearance: values.appearance,
          intensity: values.intensity,
          volume: values.volume,
          message: values.message,
          completed: true
        }, {
          onConflict: 'user_id,module_id'
        });
        
      if (error) throw error;
      
      // Mark the module as completed in user_progress
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('completed_modules, xp')
        .eq('user_id', userId)
        .single();
      
      if (progressData) {
        const completedModules = progressData.completed_modules || [];
        const moduleId = 201; // Emotion Awareness module ID
        
        if (!completedModules.includes(moduleId)) {
          const updatedModules = [...completedModules, moduleId];
          const updatedXP = (progressData.xp || 0) + 100; // XP for this module
          
          await supabase
            .from('user_progress')
            .upsert({
              user_id: userId,
              completed_modules: updatedModules,
              xp: updatedXP
            });
        }
      }
      
      toast({
        title: "Success!",
        description: "Your responses have been saved",
      });
      
      onClose();
    } catch (error) {
      console.error("Error saving responses:", error);
      toast({
        title: "Error",
        description: "Failed to save your responses",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-lg" style={{ 
        backgroundImage: "url('public/lovable-uploads/3140e869-4f86-4639-94f4-a23cf423fbdb.png')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div className="p-6 backdrop-blur-sm bg-white/75 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center font-bold text-3xl">
              <span className="text-purple-700">Your Body:</span> <span className="text-[#F5DF4D]">The Ultimate Emotional Airbnb</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 mt-6">
            <p className="text-center text-lg">
              Think of your body as a house, and emotions as visitors who keep showing up—
              sometimes uninvited! Some crash on your couch for ages, while others pop in and
              vanish before you even realise they were there. And let's be real, not all visitors are
              the fun kind. But do we slam the door in their faces? Nope! We hand them a snack, let
              them chill, and wait for them to either leave or at least stop being so annoying.
            </p>
            
            <p className="text-center text-lg">
              Every emotion that knocks on your door wants a little attention—even the ones you'd
              rather ghost. Lock the door on them, and guess what? The good vibes might get stuck outside too!
            </p>
            
            <div className="flex justify-center my-8">
              <h3 className="font-bold text-xl text-center">
                Draw or write about the emotion which is uncomfortable
              </h3>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold block text-center mb-2">
                          Where is the emotion located in the body? Is it one or many parts or the entire body
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your answer here..." 
                            className="min-h-[120px] border-2 border-black"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="appearance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold block text-center mb-2">
                          If this emotion could look like something, what would it look like? How big/small, how would the texture be?
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your answer here..." 
                            className="min-h-[120px] border-2 border-black"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="intensity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold block text-center mb-2">
                          How big/small is this emotion? Is it heavy/intense?
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your answer here..." 
                            className="min-h-[120px] border-2 border-black"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold block text-center mb-2">
                          How loud or quiet is this emotion?
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your answer here..." 
                            className="min-h-[120px] border-2 border-black"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base font-bold block text-center mb-2">
                          What message this emotion has for you? What is it saying to you right now? Does it want you do something?
                        </FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your answer here..." 
                            className="min-h-[120px] border-2 border-black"
                            {...field} 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={onClose} className="border-[#FC68B3] text-[#FC68B3]">
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    style={{ backgroundColor: "#FC68B3" }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Responses"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmotionalAwarenessActivity;
