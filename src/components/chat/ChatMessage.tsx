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
            ? "bg-primary text-white"
            : "bg-secondary text-secondary-foreground"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatMessage;