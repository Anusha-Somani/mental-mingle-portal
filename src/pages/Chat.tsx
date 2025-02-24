
import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";
import Wave from "@/components/Wave";
import DocumentUpload from "@/components/chat/DocumentUpload";
import DocumentManager from "@/components/chat/DocumentManager";
import { useAdminStatus } from "@/hooks/use-admin-status";
import { Loader2 } from "lucide-react";

const Chat = () => {
  const { isAdmin, loading } = useAdminStatus();

  return (
    <div className="min-h-screen galaxy-bg">
      <Wave />
      <Navigation />
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-[#1A1F2C] mb-4">
            Chat Support
          </h1>
          <p className="text-[#1A1F2C]/90">
            A safe space to share your thoughts and feelings. Our AI companion is here to listen and support you.
          </p>
        </div>
        <div className="grid gap-6 animate-fade-in">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#FF8A48]" />
            </div>
          ) : (
            <>
              {isAdmin && (
                <>
                  <DocumentUpload />
                  <DocumentManager />
                </>
              )}
              <ChatBot />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Chat;
