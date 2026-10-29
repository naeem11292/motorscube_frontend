
import { useCallback, useEffect, useMemo, useState } from "react";
import messagesAPI from "../../api/messages.api";
import "./Messages.css";

function getArray(response) {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.data,
    response?.messages,
    response?.data?.messages,
    response?.data?.data,
  ];

  return candidates.find(Array.isArray) || [];
}

function getCurrentUserId() {
  try {
    const token = localStorage.getItem("motorscube_token");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return Number(decoded.sub ?? decoded.id ?? decoded.user_id) || null;
  } catch {
    return null;
  }
}

function getUserName(value) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  if (typeof value !== "object") return "";

  const name =
    value.full_name ||
    value.fullName ||
    value.name ||
    value.username ||
    value.display_name ||
    value.displayName;

  if (name) return String(name).trim();

  return [
    value.first_name || value.firstname || "",
    value.last_name || value.lastname || "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();
}

function getNameFromFields(message, fields) {
  for (const field of fields) {
    const name = getUserName(message?.[field]);
    if (name) return name;
  }
  return "";
}

function getSenderName(message) {
  return getNameFromFields(message, [
    "sender_name",
    "sender_full_name",
    "sender_username",
    "sender",
    "sender_user",
    "sender_details",
    "senderUser",
  ]);
}

function getReceiverName(message) {
  return getNameFromFields(message, [
    "receiver_name",
    "receiver_full_name",
    "receiver_username",
    "receiver",
    "receiver_user",
    "receiver_details",
    "receiverUser",
  ]);
}

function getPeerName(message, peerId, currentUserId) {
  if (Number(message?.sender_id) === Number(currentUserId)) {
    return getReceiverName(message);
  }

  if (Number(message?.receiver_id) === Number(currentUserId)) {
    return getSenderName(message);
  }

  if (Number(message?.sender_id) === Number(peerId)) {
    return getSenderName(message);
  }

  if (Number(message?.receiver_id) === Number(peerId)) {
    return getReceiverName(message);
  }

  return "";
}

function getDisplayName(name, userId) {
  return name || (userId ? `User #${userId}` : "Unknown user");
}

function getInitial(name) {
  return String(name || "U").trim().charAt(0).toUpperCase() || "U";
}

function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function Messages() {
  const currentUserId = getCurrentUserId();

  const [messages, setMessages] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [newReceiverId, setNewReceiverId] = useState("");
  const [newPostType, setNewPostType] = useState("sale");
  const [newPostId, setNewPostId] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [newChatTitle, setNewChatTitle] = useState("");
  const [creatingChat, setCreatingChat] = useState(false);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await messagesAPI.getMyMessages();
      const rows = getArray(response);
      setMessages(rows);

      if (selectedChatId !== null) {
        const exists = rows.some(
          (message) =>
            Number(message.chat_id) === Number(selectedChatId)
        );

        if (!exists) {
          setSelectedChatId(null);
          setChatMessages([]);
        }
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Could not load your messages. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [selectedChatId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const conversations = useMemo(() => {
    const grouped = new Map();

    for (const message of messages) {
      const chatId = message.chat_id;
      if (chatId === null || chatId === undefined) continue;

      const senderId = Number(message.sender_id);
      const receiverId = Number(message.receiver_id);
      const peerId =
        senderId === Number(currentUserId) ? receiverId : senderId;

      const peerName = getPeerName(message, peerId, currentUserId);
      const key = String(chatId);
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          chatId,
          peerId,
          peerName,
          lastMessage: message,
        });
      } else {
        if (!existing.peerName && peerName) {
          existing.peerName = peerName;
        }

        if (
          new Date(message.message_time_date || 0).getTime() >
          new Date(existing.lastMessage.message_time_date || 0).getTime()
        ) {
          existing.lastMessage = message;
          existing.peerId = peerId;
          if (peerName) existing.peerName = peerName;
        }
      }
    }

    return Array.from(grouped.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.message_time_date || 0).getTime() -
        new Date(a.lastMessage.message_time_date || 0).getTime()
    );
  }, [messages, currentUserId]);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return conversations;

    return conversations.filter((conversation) => {
      const name = getDisplayName(
        conversation.peerName,
        conversation.peerId
      );

      const text = conversation.lastMessage?.sender_message || "";

      return (
        name.toLowerCase().includes(query) ||
        String(text).toLowerCase().includes(query) ||
        String(conversation.chatId).includes(query)
      );
    });
  }, [conversations, searchQuery]);

  const activeConversation = conversations.find(
    (conversation) =>
      Number(conversation.chatId) === Number(selectedChatId)
  );

  const activePeerName = useMemo(() => {
    if (!activeConversation) return "";

    if (activeConversation.peerName) {
      return activeConversation.peerName;
    }

    for (const message of [...chatMessages].reverse()) {
      const name = getPeerName(
        message,
        activeConversation.peerId,
        currentUserId
      );
      if (name) return name;
    }

    return "";
  }, [activeConversation, chatMessages, currentUserId]);

  const openConversation = async (conversation) => {
    setSelectedChatId(conversation.chatId);
    setChatLoading(true);
    setError("");
    setNotice("");

    try {
      const response = await messagesAPI.getMessagesByChat(
        conversation.chatId
      );
      const rows = getArray(response);
      setChatMessages(rows);

      const unread = rows.filter(
        (message) =>
          Number(message.receiver_id) === Number(currentUserId) &&
          Number(message.message_viewed) === 0 &&
          Number(message.receiver_deleted) === 0
      );

      await Promise.allSettled(
        unread.map((message) =>
          messagesAPI.markAsViewed(message.message_id)
        )
      );

      if (unread.length) await loadMessages();
    } catch (err) {
      setChatMessages([]);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Could not open this conversation."
      );
    } finally {
      setChatLoading(false);
    }
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = draft.trim();
    if (!text || !activeConversation) return;

    if (text.length > 300) {
      setError("Messages cannot exceed 300 characters.");
      return;
    }

    setSending(true);
    setError("");
    setNotice("");

    try {
      await messagesAPI.sendMessage({
        chat_id: activeConversation.chatId,
        receiver_id: activeConversation.peerId,
        message_title: title,
        sender_message: text,
      });

      setDraft("");
      setTitle("");

      const response = await messagesAPI.getMessagesByChat(
        activeConversation.chatId
      );

      setChatMessages(getArray(response));
      await loadMessages();
      setNotice("Message sent.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Message could not be sent."
      );
    } finally {
      setSending(false);
    }
  };

  const startNewChat = async (event) => {
    event.preventDefault();

    const receiverId = Number(newReceiverId);
    const postId = Number(newPostId);
    const firstMessage = newChatMessage.trim();

    if (!Number.isInteger(receiverId) || receiverId <= 0) {
      setError("Enter a valid recipient user ID.");
      return;
    }

    if (currentUserId && receiverId === currentUserId) {
      setError("You cannot start a chat with yourself.");
      return;
    }

    if (!Number.isInteger(postId) || postId <= 0) {
      setError("Enter a valid listing post ID.");
      return;
    }

    if (!firstMessage) {
      setError("Write the first message to start the conversation.");
      return;
    }

    if (firstMessage.length > 300) {
      setError("Messages cannot exceed 300 characters.");
      return;
    }

    setCreatingChat(true);
    setError("");
    setNotice("");

    try {
      const response = await messagesAPI.createChat({
        user_id_receiver: receiverId,
        post_type: newPostType,
        post_id: postId,
      });

      const chat = response?.data?.data ?? response?.data ?? response;
      const chatId = Number(chat?.id ?? chat?.chat_id);

      if (!chatId) {
        throw new Error(
          "Chat was created, but the API did not return a chat ID."
        );
      }

      await messagesAPI.sendMessage({
        chat_id: chatId,
        receiver_id: receiverId,
        message_title: newChatTitle,
        sender_message: firstMessage,
      });

      setNewReceiverId("");
      setNewPostType("sale");
      setNewPostId("");
      setNewChatMessage("");
      setNewChatTitle("");
      setShowNewChat(false);

      await loadMessages();
      setSelectedChatId(chatId);

      const chatResponse = await messagesAPI.getMessagesByChat(chatId);
      setChatMessages(getArray(chatResponse));
      setNotice("Conversation started. Your message has been sent.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Could not start the conversation. Please try again."
      );
    } finally {
      setCreatingChat(false);
    }
  };

  const deleteMessage = async (message) => {
    if (!window.confirm("Delete this message from your view?")) return;

    try {
      await messagesAPI.deleteMessage(message.message_id);

      setChatMessages((previous) =>
        previous.filter(
          (item) => Number(item.message_id) !== Number(message.message_id)
        )
      );

      await loadMessages();
      setNotice("Message deleted from your view.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Could not delete this message."
      );
    }
  };

  const viewAd = () => {
    const message = activeConversation?.lastMessage;

    const postType = message?.post_type;
    const postId = message?.post_id;

    if (postType && postId) {
      const type = String(postType).toLowerCase();
      const route =
        type === "hire"
          ? `/hire/${postId}`
          : `/sale/${postId}`;

      window.location.assign(route);
      return;
    }

    setNotice(
      "The listing link is not available in the message data yet."
    );
  };

  return (
    <main className="messages-page">
      <header className="messages-page-header">
        <div>
          <p className="messages-eyebrow">MOTORSCUBE DASHBOARD</p>
          <h1>Messages</h1>
          <p className="messages-subtitle">
            Chat with buyers and sellers about their vehicle listings.
          </p>
        </div>

        <button
          type="button"
          className="messages-refresh-button"
          onClick={loadMessages}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="messages-alert messages-alert-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="messages-alert messages-alert-success" role="status">
          {notice}
        </div>
      )}

      <section className="messages-workspace">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-heading">
            <h2>Messages</h2>
            <span>{conversations.length}</span>
          </div>

          <label className="messages-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search conversations"
            />
          </label>

          <div className="messages-new-chat-row">
            <button
              type="button"
              className="messages-new-chat-button"
              onClick={() => {
                setShowNewChat((open) => !open);
                setError("");
                setNotice("");
              }}
            >
              {showNewChat ? "Cancel" : "+ New Chat"}
            </button>
          </div>

          {showNewChat && (
            <form className="messages-new-chat-form" onSubmit={startNewChat}>
              <input
                type="number"
                min="1"
                value={newReceiverId}
                onChange={(event) => setNewReceiverId(event.target.value)}
                placeholder="Recipient user ID"
                required
              />

              <select
                value={newPostType}
                onChange={(event) => setNewPostType(event.target.value)}
                aria-label="Listing type"
                required
              >
                <option value="sale">Sale listing</option>
                <option value="hire">Hire listing</option>
              </select>

              <input
                type="number"
                min="1"
                value={newPostId}
                onChange={(event) => setNewPostId(event.target.value)}
                placeholder="Listing post ID"
                required
              />

              <input
                type="text"
                value={newChatTitle}
                onChange={(event) => setNewChatTitle(event.target.value)}
                placeholder="Subject (optional)"
                maxLength={255}
              />

              <textarea
                value={newChatMessage}
                onChange={(event) => setNewChatMessage(event.target.value)}
                placeholder="Write your first message..."
                maxLength={300}
                rows={3}
                required
              />

              <button type="submit" disabled={creatingChat}>
                {creatingChat ? "Starting..." : "Start Chat & Send"}
              </button>
            </form>
          )}

          {loading ? (
            <p className="messages-empty">Loading messages...</p>
          ) : filteredConversations.length === 0 ? (
            <div className="messages-empty">
              <span className="messages-empty-icon">✉</span>
              <strong>
                {searchQuery ? "No matching chats" : "No conversations yet"}
              </strong>
              <p>
                {searchQuery
                  ? "Try another name, message, or chat ID."
                  : "Start a new chat to contact another user."}
              </p>
            </div>
          ) : (
            <div className="messages-conversation-list">
              {filteredConversations.map((conversation) => {
                const last = conversation.lastMessage;
                const isSelected =
                  Number(selectedChatId) === Number(conversation.chatId);
                const displayName = getDisplayName(
                  conversation.peerName,
                  conversation.peerId
                );

                return (
                  <button
                    type="button"
                    key={conversation.chatId}
                    className={`messages-conversation ${
                      isSelected ? "is-selected" : ""
                    }`}
                    onClick={() => openConversation(conversation)}
                  >
                    <span className="messages-avatar">
                      {getInitial(displayName)}
                    </span>

                    <span className="messages-conversation-content">
                      <span className="messages-conversation-title">
                        {displayName}
                      </span>
                      <span className="messages-preview">
                        {last.sender_message || "No message text"}
                      </span>
                    </span>

                    <span className="messages-conversation-time">
                      {formatDate(last.message_time_date)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        <section className="messages-chat-panel">
          {!activeConversation ? (
            <div className="messages-chat-placeholder">
              <span className="messages-placeholder-icon">✉</span>
              <h2>Your messages</h2>
              <p>Select a conversation to read messages and reply.</p>
            </div>
          ) : (
            <>
              <header className="messages-chat-header">
                <span className="messages-avatar">
                  {getInitial(
                    getDisplayName(activePeerName, activeConversation.peerId)
                  )}
                </span>

                <div className="messages-chat-contact">
                  <h2>
                    {getDisplayName(
                      activePeerName,
                      activeConversation.peerId
                    )}
                  </h2>
                  <p>Conversation #{activeConversation.chatId}</p>
                </div>

                <button
                  type="button"
                  className="messages-view-ad-button"
                  onClick={viewAd}
                >
                  View Ad
                </button>
              </header>

              <div className="messages-chat-body">
                {chatLoading ? (
                  <p className="messages-empty">Loading conversation...</p>
                ) : chatMessages.length === 0 ? (
                  <p className="messages-empty">
                    No visible messages in this conversation.
                  </p>
                ) : (
                  chatMessages.map((message) => {
                    const isMine =
                      Number(message.sender_id) === Number(currentUserId);

                    const senderName = isMine
                      ? "You"
                      : getSenderName(message) ||
                        getDisplayName(
                          activePeerName,
                          activeConversation.peerId
                        );

                    return (
                      <article
                        key={message.message_id}
                        className={`messages-bubble-row ${
                          isMine ? "mine" : "theirs"
                        }`}
                      >
                        <div className="messages-bubble">
                          <span className="messages-sender-name">
                            {senderName}
                          </span>

                          {message.message_title && (
                            <strong className="messages-bubble-title">
                              {message.message_title}
                            </strong>
                          )}

                          <p>{message.sender_message}</p>

                          <div className="messages-bubble-footer">
                            <time>
                              {formatDate(message.message_time_date)}
                            </time>

                            <button
                              type="button"
                              onClick={() => deleteMessage(message)}
                              title="Delete message from your view"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>

              <form className="messages-compose" onSubmit={sendMessage}>
                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Subject (optional)"
                  maxLength={255}
                  aria-label="Message subject"
                />

                <div className="messages-compose-row">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Write a message..."
                    maxLength={300}
                    rows={2}
                    required
                    aria-label="Message text"
                  />

                  <button
                    type="submit"
                    disabled={sending || !draft.trim() || chatLoading}
                  >
                    {sending ? "Sending..." : "Send ➤"}
                  </button>
                </div>

                <span className="messages-character-count">
                  {draft.length}/300 characters
                </span>
              </form>
            </>
          )}
        </section>
      </section>
    </main>
  );
}
