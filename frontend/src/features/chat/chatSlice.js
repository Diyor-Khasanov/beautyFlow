import { createSlice } from "@reduxjs/toolkit";

const initialConversations = [
  {
    id: 1,
    name: "Master Ali",
    lastMessage: "Yangi buyurtma qabul qildingizmi?",
    unreadCount: 2,
    isActive: true,
  },
  {
    id: 2,
    name: "Client Sarvinoz K.",
    lastMessage: "Narxlar qancha bo'ladi?",
    unreadCount: 0,
    isActive: false,
  },
  {
    id: 3,
    name: "Master Lola T.",
    lastMessage: "Ta'tildan keyin ishni boshladim.",
    unreadCount: 0,
    isActive: false,
  },
];

const initialMessages = [
  {
    id: 101,
    chatId: 1,
    sender: "Master Ali",
    text: "Salom, buyurtma tayyormi?",
    timestamp: "14:00",
    isMine: false,
  },
  {
    id: 102,
    chatId: 1,
    sender: "Me",
    text: "Hozir tekshiraman. Kuting.",
    timestamp: "14:02",
    isMine: true,
  },
  {
    id: 103,
    chatId: 1,
    sender: "Master Ali",
    text: "Kutaman. Rahmat.",
    timestamp: "14:03",
    isMine: false,
  },
];

const initialState = {
  activeChatId: 1,
  conversations: initialConversations,
  messages: initialMessages,
  isConnected: true,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      const newChatId = action.payload;
      state.activeChatId = newChatId;

      state.messages = initialState.messages.filter(
        (msg) => msg.chatId === newChatId
      );

      state.conversations = state.conversations.map((conv) => ({
        ...conv,
        isActive: conv.id === newChatId,
        unreadCount: conv.id === newChatId ? 0 : conv.unreadCount,
      }));
    },
    addMessage: (state, action) => {
      const newMessage = {
        id: Date.now(),
        chatId: state.activeChatId,
        sender: "Me",
        text: action.payload,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMine: true,
      };
      state.messages.push(newMessage);

      state.conversations = state.conversations.map((conv) => {
        if (conv.id === state.activeChatId) {
          return { ...conv, lastMessage: action.payload };
        }
        return conv;
      });
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;
    },
    receiveMessage: (state, action) => {
      const receivedMessage = {
        id: Date.now() + 1,
        chatId: action.payload.chatId,
        sender: action.payload.sender,
        text: action.payload.text,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMine: false,
      };

      if (state.activeChatId === action.payload.chatId) {
        state.messages.push(receivedMessage);
      } else {
        state.conversations = state.conversations.map((conv) => {
          if (conv.id === action.payload.chatId) {
            return {
              ...conv,
              unreadCount: conv.unreadCount + 1,
              lastMessage: action.payload.text,
            };
          }
          return conv;
        });
      }
    },
  },
});

export const {
  setActiveChat,
  addMessage,
  setConnectionStatus,
  receiveMessage,
} = chatSlice.actions;

export default chatSlice.reducer;
