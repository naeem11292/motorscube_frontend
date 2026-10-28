
import axiosInstance from "./axios";

const MESSAGES_URL = "/messages";
const CHAT_BOX_URL = "/chat-box";

const messagesAPI = {
  // Create a new chat or retrieve an existing chat
  createChat: async ({ user_id_receiver, post_type, post_id }) => {
    const response = await axiosInstance.post(CHAT_BOX_URL, {
      user_id_receiver: Number(user_id_receiver),
      post_type: post_type.trim(),
      post_id: Number(post_id),
    });

    return response.data;
  },

  // Get all messages belonging to the logged-in user
  getMyMessages: async () => {
    const response = await axiosInstance.get(MESSAGES_URL);
    return response.data;
  },

  // Get messages for a specific conversation
  getMessagesByChat: async (chatId) => {
    const response = await axiosInstance.get(
      `${MESSAGES_URL}/chat/${chatId}`
    );
    return response.data;
  },

  // Send a message
  sendMessage: async ({
    chat_id,
    receiver_id,
    message_title,
    sender_message,
  }) => {
    const response = await axiosInstance.post(MESSAGES_URL, {
      chat_id: Number(chat_id),
      receiver_id: Number(receiver_id),
      ...(message_title?.trim()
        ? { message_title: message_title.trim() }
        : {}),
      sender_message: sender_message.trim(),
    });

    return response.data;
  },

  // Get a specific message
  getMessageById: async (messageId) => {
    const response = await axiosInstance.get(
      `${MESSAGES_URL}/${messageId}`
    );
    return response.data;
  },

  // Mark a received message as viewed
  markAsViewed: async (messageId) => {
    const response = await axiosInstance.put(
      `${MESSAGES_URL}/${messageId}/view`
    );
    return response.data;
  },

  // Delete a message from the current user's view
  deleteMessage: async (messageId) => {
    const response = await axiosInstance.delete(
      `${MESSAGES_URL}/${messageId}`
    );
    return response.data;
  },
};

export default messagesAPI;
