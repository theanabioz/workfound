'use client';

import { Search, Send, Paperclip, MoreVertical, CheckCircle2, Loader2, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
  return <SeekerMessagesPage />;
}

function SeekerMessagesPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        fetchChats(user.id);
      }
    };
    init();
  }, [supabase, fetchChats]);

  // Real-time subscription
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase
      .channel('seeker-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `seeker_id=eq.${currentUser.id}`
        },
        () => {
          fetchChats(currentUser.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser, supabase, fetchChats]);

  const fetchChats = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          employer:employer_id (
            id,
            company_name
          )
        `)
        .eq('seeker_id', userId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else if (data) {
        const groupedChats: Record<string, any> = {};
        
        data.forEach((msg: any) => {
          const employerId = msg.employer_id;
          const companyName = msg.employer?.company_name || 'Работодатель';
          
          if (!groupedChats[employerId]) {
            groupedChats[employerId] = {
              id: employerId,
              employer_id: employerId,
              name: companyName,
              initial: companyName.charAt(0).toUpperCase(),
              status: 'В сети',
              lastSeen: 'Недавно',
              messages: [],
              lastMessageTime: msg.created_at
            };
          }
          
          const date = new Date(msg.created_at);
          const messageTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          groupedChats[employerId].messages.push({
            id: msg.id,
            isSender: !msg.is_sender_employer,
            text: msg.text,
            time: messageTime,
            created_at: msg.created_at
          });
          
          groupedChats[employerId].lastMessage = msg.text;
          groupedChats[employerId].lastMessageTime = msg.created_at;
        });

        const chatsArray = Object.values(groupedChats).sort((a: any, b: any) => {
          return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
        });

        setChats(chatsArray);
      }
    } catch (err: any) {
      console.error('Error in fetchChats:', err);
      setError('Не удалось загрузить сообщения.');
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !activeChat || !currentUser) return;

    const text = messageInput.trim();
    setMessageInput('');

    try {
      const newMessage = {
        employer_id: activeChat.employer_id,
        seeker_id: currentUser.id,
        text: text,
        is_sender_employer: false
      };

      const { error } = await supabase
        .from('messages')
        .insert([newMessage]);

      if (error) throw error;
      
      fetchChats(currentUser.id);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Ошибка при отправке сообщения');
      setMessageInput(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Сообщения</h1>
      </div>

      <div className="flex-1 bg-white rounded-none border border-zinc-200 overflow-hidden flex relative">
        
        {/* Contacts Sidebar */}
        <div className={`w-full md:w-80 border-r border-zinc-200 flex flex-col bg-zinc-50/50 ${isMobileChatOpen ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-zinc-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Поиск компаний..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-300 rounded-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 outline-none text-sm transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                {searchQuery ? 'Ничего не найдено' : 'У вас пока нет сообщений.'}
              </div>
            ) : (
              filteredChats.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => {
                    setActiveChatId(chat.id);
                    setIsMobileChatOpen(true);
                  }}
                  className={`p-4 border-b border-zinc-200 cursor-pointer transition-colors relative ${activeChatId === chat.id ? 'bg-zinc-100' : 'bg-white hover:bg-zinc-50'}`}
                >
                  {activeChatId === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-900"></div>}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 border text-zinc-700 rounded-none flex items-center justify-center font-bold text-sm shrink-0 ${activeChatId === chat.id ? 'bg-white border-zinc-200' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                      {chat.initial || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm truncate ${activeChatId === chat.id ? 'font-bold text-zinc-900' : 'font-medium text-zinc-900'}`}>
                          {chat.name}
                        </h3>
                        <span className="text-[10px] font-medium text-zinc-400">
                          {chat.messages.length > 0 && chat.messages[chat.messages.length - 1].time}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-zinc-600' : 'text-zinc-500'}`}>
                        {chat.lastMessage || 'Нет сообщений'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-col flex-1 bg-white ${isMobileChatOpen ? 'flex' : 'hidden md:flex'}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-zinc-200 px-4 md:px-6 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsMobileChatOpen(false)}
                    className="md:hidden p-1 -ml-1 text-zinc-400 hover:text-zinc-900"
                  >
                    <Search className="w-5 h-5 rotate-90" />
                  </button>
                  <div className="w-8 h-8 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-none flex items-center justify-center font-bold text-sm">
                    {activeChat.initial || '?'}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-zinc-900">{activeChat.name}</h2>
                    <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500"></span>
                      {activeChat.status}
                    </div>
                  </div>
                </div>
                <button className="text-zinc-400 hover:text-zinc-600 transition-colors p-1 rounded-none hover:bg-zinc-100">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-zinc-50/50">
                {activeChat.messages?.map((message: any, index: number) => {
                  const showDate = index === 0 || 
                    new Date(message.created_at).toDateString() !== new Date(activeChat.messages[index-1].created_at).toDateString();
                  
                  return (
                    <div key={message.id} className="space-y-6">
                      {showDate && (
                        <div className="flex justify-center">
                          <span className="text-[10px] font-medium text-zinc-500 bg-white border border-zinc-200 px-2 py-1 rounded-none">
                            {new Date(message.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                          </span>
                        </div>
                      )}
                      <div className={`flex gap-3 max-w-2xl ${message.isSender ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-none flex items-center justify-center font-bold text-sm shrink-0 mt-1 ${message.isSender ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-700'}`}>
                          {message.isSender ? 'Я' : activeChat.initial || '?'}
                        </div>
                        <div className={`flex flex-col ${message.isSender ? 'items-end' : 'items-start'}`}>
                          <div className={`p-3 rounded-none text-sm whitespace-pre-wrap ${message.isSender ? 'bg-zinc-900 text-white' : 'bg-white border border-zinc-200 text-zinc-800'}`}>
                            {message.text}
                          </div>
                          <div className={`text-[10px] text-zinc-500 mt-1 font-medium flex items-center gap-1 ${message.isSender ? 'mr-1' : 'ml-1'}`}>
                            {message.time} {message.isSender && <CheckCircle2 className="w-3 h-3 text-zinc-400" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-zinc-200">
                <div className="flex items-end gap-2 bg-white border border-zinc-300 rounded-none p-1.5 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all">
                  <button className="p-2 text-zinc-400 hover:text-zinc-700 transition-colors shrink-0 rounded-none hover:bg-zinc-100">
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <textarea 
                    rows={1}
                    placeholder="Напишите сообщение..." 
                    className="w-full bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-zinc-900 outline-none max-h-32"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  ></textarea>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white rounded-none transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
              <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-zinc-200" />
              </div>
              <h3 className="text-zinc-900 font-bold mb-1">Ваши сообщения</h3>
              <p className="text-sm max-w-xs">Выберите компанию из списка слева, чтобы начать переписку</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
