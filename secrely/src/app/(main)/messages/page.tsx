"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Search, Send, Circle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/data/messages";
import { useAuthStore } from "@/store/authStore";
import { timeAgo, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [localMessages, setLocalMessages] = useState(MOCK_MESSAGES);
  const { user } = useAuthStore();

  const activeConversation = MOCK_CONVERSATIONS.find((c) => c.id === activeConv);
  const messages = activeConv ? (localMessages[activeConv] ?? []) : [];

  const handleSend = () => {
    if (!message.trim() || !activeConv || !user) return;
    const newMsg = {
      id: `msg_${Date.now()}`,
      fromUser: user,
      toUserId: activeConversation?.participant.id ?? "",
      content: message.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] ?? []), newMsg],
    }));
    setMessage("");
  };

  return (
    <div className="flex gap-4 h-[calc(100vh-9rem)]">
      {/* Conversation list */}
      <div className={cn(
        "flex flex-col gap-2 w-full md:w-72 flex-shrink-0",
        activeConv && "hidden md:flex"
      )}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search messages…" className="pl-9" />
        </div>
        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {MOCK_CONVERSATIONS.map((conv) => (
            <motion.button
              key={conv.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setActiveConv(conv.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-secondary",
                activeConv === conv.id && "bg-purple-50 hover:bg-purple-50"
              )}
            >
              <div className="relative flex-shrink-0">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={conv.participant.avatar} />
                  <AvatarFallback className="text-xs">{getInitials(conv.participant.displayName)}</AvatarFallback>
                </Avatar>
                {conv.isOnline && (
                  <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-emerald-500 text-emerald-500 bg-white rounded-full" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-semibold text-foreground truncate">{conv.participant.displayName}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{timeAgo(conv.lastMessageAt)}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
              </div>
              {conv.unreadCount > 0 && (
                <span className="w-5 h-5 flex-shrink-0 bg-[hsl(270,75%,60%)] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {conv.unreadCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {activeConv && activeConversation ? (
        <div className={cn("flex-1 flex flex-col card-base overflow-hidden", "flex")}>
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <button onClick={() => setActiveConv(null)} className="md:hidden text-muted-foreground hover:text-foreground text-sm">← Back</button>
            <Avatar className="w-8 h-8">
              <AvatarImage src={activeConversation.participant.avatar} />
              <AvatarFallback className="text-xs">{getInitials(activeConversation.participant.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-semibold">{activeConversation.participant.displayName}</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                {activeConversation.isOnline ? (
                  <><Circle className="w-2 h-2 fill-emerald-500 text-emerald-500" /> Online</>
                ) : "Offline"}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <EmptyState
                icon={<Send className="w-6 h-6" />}
                title="Start the conversation"
                description={`Send a message to ${activeConversation.participant.displayName}`}
              />
            ) : (
              messages.map((msg) => {
                const isMe = msg.fromUser.id === user?.id;
                return (
                  <div key={msg.id} className={cn("flex gap-2", isMe && "flex-row-reverse")}>
                    {!isMe && (
                      <Avatar className="w-7 h-7 flex-shrink-0 mt-1">
                        <AvatarImage src={msg.fromUser.avatar} />
                        <AvatarFallback className="text-[10px]">{getInitials(msg.fromUser.displayName)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className={cn(
                      "max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed",
                      isMe
                        ? "bg-[hsl(270,75%,60%)] text-white rounded-tr-sm"
                        : "bg-secondary text-foreground rounded-tl-sm"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border flex gap-2">
            <Input
              placeholder={`Message ${activeConversation.participant.displayName}…`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button size="icon" variant="purple" disabled={!message.trim()} onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 card-base items-center justify-center">
          <EmptyState
            icon={<Send className="w-6 h-6" />}
            title="Select a conversation"
            description="Choose a message thread from the left to start chatting"
          />
        </div>
      )}
    </div>
  );
}
