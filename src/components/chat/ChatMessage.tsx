
import { FC } from "react";
import { User, CircuitBoard } from "lucide-react";
import { format } from "date-fns";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

const ChatMessage: FC<ChatMessageProps> = ({ text, isUser, timestamp }) => {
  // Function to process text and convert *text* to bold
  const processText = (content: string) => {
    const parts = content.split(/(\*[^*]+\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('*') && part.endsWith('*')) {
        // Remove asterisks and wrap in bold
        return <strong key={index}>{part.slice(1, -1)}</strong>;
      }
      return part;
    });
  };

  return (
    <div
      className={`mb-4 flex items-end gap-2 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div className="flex flex-col items-center mb-1">
        {isUser ? (
          <User className="h-6 w-6 text-[#6B7280]" />
        ) : (
          <CircuitBoard className="h-6 w-6 text-[#6B7280]" />
        )}
        <span className="text-xs text-[#6B7280] mt-1">
          {isUser ? "You" : "MindVincible"}
        </span>
      </div>

      <div
        className={`relative max-w-[80%] p-4 ${
          isUser
            ? "bg-[#3DFDFF]/80 rounded-t-lg rounded-bl-lg rounded-br-sm"
            : "bg-[#FF8A48]/30 rounded-t-lg rounded-br-lg rounded-bl-sm"
        }`}
      >
        <div className="text-[#1A1F2C] text-sm">
          {processText(text)}
        </div>
        
        {timestamp && (
          <div className="text-[0.65rem] text-gray-500 mt-1">
            {format(timestamp, 'h:mm a')}
          </div>
        )}
        
        {/* Chat bubble triangle */}
        <div
          className={`absolute bottom-0 ${
            isUser 
              ? "right-0 border-l-[#3DFDFF]" 
              : "left-0 border-r-[#FF8A48]"
          } w-4 h-4 transform ${
            isUser
              ? "translate-x-1/2 translate-y-1/2 rotate-45"
              : "-translate-x-1/2 translate-y-1/2 rotate-45"
          }`}
          style={{
            backgroundColor: isUser ? "rgba(61, 253, 255, 0.8)" : "rgba(255, 138, 72, 0.3)",
          }}
        />
      </div>
    </div>
  );
};

export default ChatMessage;
