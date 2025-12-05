'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Conversation, Message, getConversations, getMessages, sendMessage } from '@/lib/supabase-service';
import { Send, User, Briefcase } from 'lucide-react';

export function ChatSystem({ currentUserId }: { currentUserId: string }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();

  // 1. Load Conversations
  useEffect(() => {
    getConversations().then(setConversations);
  }, []);

  // 2. Load Messages & Subscribe to Realtime
  useEffect(() => {
    if (!activeConvId) return;

    const loadMsgs = async () => {
      const data = await getMessages(activeConvId);
      setMessages(data);
      scrollToBottom();
    };
    loadMsgs();

    // Subscribe
    const channel = supabase
      .channel('chat_room')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConvId}`,
        },
        (payload) => {
          const newMsg = payload.new as any;
          // Add to list
          setMessages(prev => [...prev, {
            id: newMsg.id,
            conversationId: newMsg.conversation_id,
            senderId: newMsg.sender_id,
            content: newMsg.content,
            isRead: newMsg.is_read,
            createdAt: newMsg.created_at
          }]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConvId) return;

    const tempContent = newMessage;
    setNewMessage('');

    try {
      await sendMessage(activeConvId, tempContent);
      // Optimistic update not needed because Realtime will catch it
    } catch (error) {
      console.error(error);
      alert('Ошибка отправки');
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden h-[calc(100vh-120px)] flex">
      
      {/* SIDEBAR (LIST) */}
      <div className="w-80 border-r border-gray-100 bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b border-gray-100 font-bold text-gray-700">
          Сообщения
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-4 text-sm text-gray-400 text-center">Нет активных диалогов</div>
          ) : (
            conversations.map(conv => (
              <div 
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className={`p-4 cursor-pointer hover:bg-white hover:shadow-sm transition-all border-b border-gray-50 ${
                  activeConvId === conv.id ? 'bg-white border-l-4 border-l-black shadow-sm' : 'border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold">
                    {conv.otherUser?.fullName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{conv.otherUser?.fullName}</h4>
                    <p className="text-xs text-gray-500 truncate">
                      {conv.lastMessage || 'Начните общение...'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MAIN (CHAT) */}
      <div className="flex-1 flex flex-col bg-white">
        {activeConv ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                  {activeConv.otherUser?.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{activeConv.otherUser?.fullName}</h3>
                  <p className="text-xs text-gray-500 capitalize">{activeConv.otherUser?.role === 'employer' ? 'Работодатель' : 'Соискатель'}</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map(msg => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      isMe 
                        ? 'bg-black text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}>
                      {msg.content}
                      <div className={`text-[10px] mt-1 text-right ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  placeholder="Напишите сообщение..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black focus:border-transparent transition-all outline-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-2 p-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Briefcase className="w-16 h-16 mb-4 opacity-20" />
            <p>Выберите диалог слева</p>
          </div>
        )}
      </div>

    </div>
  );
}
