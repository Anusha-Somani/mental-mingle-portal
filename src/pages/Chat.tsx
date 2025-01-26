import Navigation from "@/components/Navigation";
import ChatBot from "@/components/ChatBot";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Chat Support
          </h1>
          <p className="text-gray-600">
            A safe space to share your thoughts and feelings. Our AI companion is here to listen and support you.
          </p>
        </div>
        <div className="animate-fade-in">
          <ChatBot />
        </div>
      </main>
    </div>
  );
};

export default Chat;