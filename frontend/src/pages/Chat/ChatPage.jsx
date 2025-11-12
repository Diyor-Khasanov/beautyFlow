import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MessageSquare, Send, User, Menu, Phone, Video } from "lucide-react";
import { setActiveChat, addMessage } from "../../features/chat/chatSlice";

const ConversationItem = ({ chat, onSelectChat }) => (
  <div
    onClick={() => onSelectChat(chat.id)}
    className={`p-4 cursor-pointer transition flex justify-between items-center ${
      chat.isActive
        ? "bg-bg-primary border-l-4 border-accent-blue"
        : "hover:bg-bg-primary"
    }`}
  >
    <div className="flex-grow min-w-0">
      <p className="font-medium text-text-default truncate">{chat.name}</p>
      <p className="text-sm text-text-muted truncate min-w-0">
        {chat.lastMessage}
      </p>
    </div>
    {chat.unreadCount > 0 && (
      <span className="ml-2 w-6 h-6 flex items-center justify-center bg-accent-red text-white text-xs rounded-full flex-shrink-0">
        {chat.unreadCount}
      </span>
    )}
  </div>
);

const MessageBubble = ({ message }) => (
  <div className={`flex ${message.isMine ? "justify-end" : "justify-start"}`}>
    <div
      className={`
        p-3 rounded-xl max-w-[80%] md:max-w-[60%] shadow-md 
        ${
          message.isMine
            ? "bg-accent-blue text-white rounded-br-none"
            : "bg-bg-primary text-text-default rounded-tl-none border border-border-color"
        }
      `}
    >
      <p>{message.text}</p>
      <span
        className={`block text-xs mt-1 ${
          message.isMine ? "text-white/70" : "text-text-muted"
        }`}
      >
        {message.timestamp}
      </span>
    </div>
  </div>
);

const ChatPage = () => {
  const dispatch = useDispatch();
  const { isConnected, conversations, activeChatId, messages } = useSelector(
    (state) => state.chat
  );
  const [messageText, setMessageText] = useState("");
  const messagesEndRef = useRef(null);

  const activeChat = conversations.find((c) => c.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSelectChat = (chatId) => {
    dispatch(setActiveChat(chatId));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() === "") return;

    dispatch(addMessage(messageText.trim()));
    setMessageText("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-default flex items-center space-x-3">
        <MessageSquare className="w-7 h-7 text-accent-blue" />
        <span>Muloqot (Chat)</span>
        <span
          className={`text-base ${
            isConnected ? "text-green-500" : "text-accent-red"
          }`}
        >
          ({isConnected ? "Online" : "Offline"})
        </span>
      </h1>

      <div className="flex h-[75vh] bg-bg-secondary rounded-xl shadow-card-dark overflow-hidden">
        <div className="w-full sm:w-1/3 border-r border-border-color flex flex-col">
          <div className="p-4 border-b border-border-color">
            <h2 className="text-xl font-semibold text-text-default">
              Suhbatlar
            </h2>
          </div>
          <div className="flex-grow overflow-y-auto">
            {conversations.map((chat) => (
              <ConversationItem
                key={chat.id}
                chat={chat}
                onSelectChat={handleSelectChat}
              />
            ))}
          </div>
        </div>

        <div className="flex-grow hidden sm:flex flex-col">
          <div className="p-4 border-b border-border-color bg-bg-primary flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <User className="w-8 h-8 p-1 rounded-full bg-accent-blue text-white" />
              <span className="font-semibold text-text-default">
                {activeChat?.name || "Suhbatni tanlang"}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-text-muted">
              <Phone
                className="w-5 h-5 cursor-pointer hover:text-accent-blue transition"
                title="Audio Call"
              />
              <Video
                className="w-5 h-5 cursor-pointer hover:text-accent-blue transition"
                title="Video Call"
              />
              <Menu
                className="w-5 h-5 cursor-pointer hover:text-accent-blue transition"
                title="Chat Settings"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-bg-primary">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-border-color bg-bg-secondary"
          >
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder={"Xabar yozing..."}
                className="flex-grow p-3 rounded-full bg-bg-primary border border-border-color text-text-default focus:ring-2 focus:ring-accent-blue outline-none"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className={`p-3 rounded-full text-white transition duration-200 
                  ${
                    messageText.trim()
                      ? "bg-accent-blue hover:bg-opacity-90"
                      : "bg-text-muted cursor-not-allowed"
                  }`}
                title={"Yuborish"}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
