import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send, Sparkles, MessageSquare, Hash } from "lucide-react";
import { ChatMessage } from "../types";
import { summarizeChat, tagChat } from "../services/geminiService";
import ReactMarkdown from "react-markdown";

export default function ChatRoom({ roomName, t }: { roomName: string; t: any }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socketRef.current = io();
    socketRef.current.emit("join-room", roomName);

    socketRef.current.on("receive-message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [roomName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;

    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      user: "You",
      text: input,
      timestamp: Date.now(),
    };

    socketRef.current.emit("send-message", { room: roomName, ...newMessage });
    setInput("");
  };

  const handleAIAction = async () => {
    if (messages.length < 2) return;
    setIsSummarizing(true);
    try {
      const [newSummary, newTags] = await Promise.all([
        summarizeChat(messages),
        tagChat(messages)
      ]);
      setSummary(newSummary);
      setTags(newTags);
    } catch (error) {
      console.error("AI Action failed:", error);
    } finally {
      setIsSummarizing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-dark/50 border border-border">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-text-dim space-y-2">
            <MessageSquare size={32} strokeWidth={1} />
            <p className="text-[10px] uppercase tracking-widest font-bold">{t.noMessages}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className="border-l-2 border-brand-red pl-3 py-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase text-brand-red">{msg.user}</span>
            </div>
            <div className="text-xs text-text-dim leading-relaxed">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t.typeMessage}
            className="flex-1 bg-brand-dark border border-border px-4 py-2 text-xs text-text-main focus:outline-none focus:border-brand-red transition-colors"
          />
          <button
            onClick={sendMessage}
            className="bg-brand-red text-white px-4 py-2 text-xs font-bold uppercase tracking-widest"
          >
            {t.send}
          </button>
        </div>

        <div className="bg-brand-dark/30 p-4 border-l-4 border-brand-red">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[9px] bg-brand-red/20 text-brand-red px-2 py-1 font-bold uppercase tracking-widest">{t.aiSummary}</div>
            <button 
              onClick={handleAIAction}
              disabled={isSummarizing || messages.length < 2}
              className="text-[9px] font-bold uppercase tracking-widest text-text-dim hover:text-text-main disabled:opacity-50"
            >
              {isSummarizing ? "..." : t.refresh}
            </button>
          </div>
          {summary ? (
            <div className="text-[12px] text-text-dim leading-relaxed italic">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-[10px] text-text-dim/50 italic">{t.analysisPending}</p>
          )}
          
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map(tag => (
              <span key={tag} className="text-[9px] text-brand-red font-bold uppercase tracking-widest">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
