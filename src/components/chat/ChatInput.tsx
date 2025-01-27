import { FC } from "react";
import { Send } from "lucide-react";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  handleSend: () => void;
}

const ChatInput: FC<ChatInputProps> = ({ input, setInput, handleSend }) => {
  return (
    <div className="border-t p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;