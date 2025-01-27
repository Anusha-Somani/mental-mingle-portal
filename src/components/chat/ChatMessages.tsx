import { FC } from "react";
import ChatMessage from "./ChatMessage";

interface ChatMessagesProps {
  messages: Array<{ text: string; isUser: boolean }>;
}

const ChatMessages: FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message, index) => (
        <ChatMessage key={index} {...message} />
      ))}
    </div>
  );
};

export default ChatMessages;