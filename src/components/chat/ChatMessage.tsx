
import { FC } from "react";

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

const ChatMessage: FC<ChatMessageProps> = ({ text, isUser }) => {
  return (
    <div
      className={`mb-4 ${
        isUser ? "flex justify-end" : "flex justify-start"
      }`}
    >
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          isUser
            ? "bg-[#D5D5F1]/80 text-[#1A1F2C]"
            : "bg-[#E5DEFF]/60 text-[#1A1F2C]"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;
