
import { FC } from "react";
import { format, isToday, isYesterday } from "date-fns";
import ChatMessage from "./ChatMessage";

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: FC<ChatMessagesProps> = ({ messages }) => {
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    }
    return format(date, "MMMM d, yyyy");
  };

  let currentDate: string | null = null;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {messages.map((message, index) => {
        let dateElement = null;
        
        if (message.timestamp) {
          const messageDate = formatDate(message.timestamp);
          if (messageDate !== currentDate) {
            currentDate = messageDate;
            dateElement = (
              <div className="flex items-center justify-center my-4">
                <div className="bg-gray-200 rounded-full px-4 py-1">
                  <span className="text-xs text-gray-600">{messageDate}</span>
                </div>
              </div>
            );
          }
        }

        return (
          <div key={index}>
            {dateElement}
            <ChatMessage {...message} />
          </div>
        );
      })}
    </div>
  );
};

export default ChatMessages;
