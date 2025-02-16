import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Wave from "@/components/Wave";
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        toast({
          title: "Success!",
          description: "Please check your email to verify your account."
        });
      } else {
        const {
          error
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          if (error.message === "Invalid login credentials") {
            throw new Error("Invalid email or password. Please try again.");
          }
          throw error;
        }
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen relative bg-gradient-to-br from-secondary/20 to-primary/20">
      <Wave />
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md p-8 bg-secondary/30 backdrop-blur-md shadow-lg border border-secondary/20 rounded-3xl bg-red-400 hover:bg-red-300">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <form onSubmit={handleAuth} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="bg-white/50 border-secondary/30 text-gray-800 placeholder:text-gray-600" required />
            <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="bg-white/50 border-secondary/30 text-gray-800 placeholder:text-gray-600" required />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
              {isLoading ? "Loading..." : isSignUp ? "Sign Up" : "Sign In"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <button onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline">
              {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default Auth;