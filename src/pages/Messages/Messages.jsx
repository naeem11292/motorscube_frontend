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
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return Number(decoded.sub ?? decoded.id ?? decoded.user_id) || null;
  } catch {
    return null;
  }
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
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await messagesAPI.getMyMessages();
      const rows = getArray(response);
      setMessages(rows);

      if (selectedChatId !== null) {
        const stillExists = rows.some(
          (message) => Number(message.chat_id) === Number(selectedChatId)
        );

        if (!stillExists) {
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
        senderId === currentUserId ? receiverId : senderId;

      const key = String(chatId);
      const existing = grouped.get(key);

      if (!existing) {
        grouped.set(key, {
          chatId,
          peerId,
          lastMessage: message,
          messages: [message],
        });
      } else {
        existing.messages.push(message);

        if (
          new Date(message.message_time_date || 0).getTime() >
          new Date(existing.lastMessage.message_time_date || 0).getTime()
        ) {
          existing.lastMessage = message;
          existing.peerId = peerId;
        }
      }
    }

    return Array.from(grouped.values()).sort(
      (a, b) =>
        new Date(b.lastMessage.message_time_date || 0).getTime() -
        new Date(a.lastMessage.message_time_date || 0).getTime()
    );
  }, [messages, currentUserId]);

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
          Number(message.receiver_id) === currentUserId &&
          Number(message.message_viewed) === 0 &&
          Number(message.receiver_deleted) === 0
      );

      await Promise.allSettled(
        unread.map((message) =>
          messagesAPI.markAsViewed(message.message_id)
        )
      );

      if (unread.length) {
        await loadMessages();
      }
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

  const activeConversation = conversations.find(
    (conversation) =>
      Number(conversation.chatId) === Number(selectedChatId)
  );

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

  const deleteMessage = async (message) => {
    const confirmed = window.confirm(
      "Delete this message from your view?"
    );
    if (!confirmed) return;

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

  return (
    <main className="messages-page">
      <header className="messages-page-header">
        <div>
          <p className="messages-eyebrow">MOTORSCUBE DASHBOARD</p>
          <h1>Messages</h1>
          <p className="messages-subtitle">
            View your conversations and communicate with other users.
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

      {error && <div className="messages-alert messages-alert-error">{error}</div>}
      {notice && (
        <div className="messages-alert messages-alert-success">{notice}</div>
      )}

      <section className="messages-workspace">
        <aside className="messages-sidebar">
          <div className="messages-sidebar-heading">
            <h2>Conversations</h2>
            <span>{conversations.length}</span>
          </div>

          {loading ? (
            <p className="messages-empty">Loading messages...</p>
          ) : conversations.length === 0 ? (
            <div className="messages-empty">
              <span className="messages-empty-icon">💬</span>
              <strong>No conversations yet</strong>
              <p>
                Conversations will appear here when messages are associated
                with a chat.
              </p>
            </div>
          ) : (
            <div className="messages-conversation-list">
              {conversations.map((conversation) => {
                const last = conversation.lastMessage;
                const isSelected =
                  Number(selectedChatId) === Number(conversation.chatId);
                const preview = last.sender_message || "No message text";

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
                      {String(conversation.peerId || "?").slice(0, 1)}
                    </span>

                    <span className="messages-conversation-content">
                      <span className="messages-conversation-title">
                        User #{conversation.peerId ?? "Unknown"}
                      </span>
                      <span className="messages-preview">{preview}</span>
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
                  {String(activeConversation.peerId || "?").slice(0, 1)}
                </span>
                <div>
                  <h2>User #{activeConversation.peerId ?? "Unknown"}</h2>
                  <p>Conversation #{activeConversation.chatId}</p>
                </div>
              </header>

              <div className="messages-chat-body">
                {chatLoading ? (
                  <p className="messages-empty">Loading conversation...</p>
                ) : chatMessages.length === 0 ? (
                  <p className="messages-empty">No visible messages in this conversation.</p>
                ) : (
                  chatMessages.map((message) => {
                    const isMine =
                      Number(message.sender_id) === currentUserId;

                    return (
                      <article
                        key={message.message_id}
                        className={`messages-bubble-row ${
                          isMine ? "mine" : "theirs"
                        }`}
                      >
                        <div className="messages-bubble">
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
                    {sending ? "Sending..." : "Send"}
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
