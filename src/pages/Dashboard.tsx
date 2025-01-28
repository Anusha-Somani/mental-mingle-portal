import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Slider } from "@/components/ui/slider";
import { Heart, Smile, Frown } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState(50);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setUserType(profile.user_type);
      }
    };

    checkAuth();
  }, [navigate]);

  const getMoodIcon = () => {
    if (mood < 33) return <Frown className="w-8 h-8 text-red-500" />;
    if (mood < 66) return <Smile className="w-8 h-8 text-yellow-500" />;
    return <Heart className="w-8 h-8 text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">How are you feeling today?</h2>
          <div className="flex items-center justify-center mb-4">
            {getMoodIcon()}
          </div>
          <Slider
            value={[mood]}
            onValueChange={(value) => setMood(value[0])}
            max={100}
            step={1}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>Not Great</span>
            <span>Okay</span>
            <span>Amazing!</span>
          </div>
        </div>

        {userType && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Resources for {userType}s
            </h2>
            <p className="text-gray-600">
              Personalized resources will be displayed here based on your role as a {userType}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;