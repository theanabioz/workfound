'use client';

import { Search, Send, Paperclip, MoreVertical, CheckCircle2, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function MessagesPage() {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchChats() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Необходима авторизация');
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          employer:employer_id (
            id,
            company_name
          )
        `)
        .eq('seeker_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setChats([]);
      } else if (data) {
        // Group messages by employer_id
        const groupedChats: Record<string, any> = {};
        
        data.forEach((msg: any) => {
          const employerId = msg.employer_id;
          if (!groupedChats[employerId]) {
            groupedChats[employerId] = {
              id: employerId,
              employer_id: employerId,
              company: msg.employer?.company_name || 'Работодатель',
              initial: (msg.employer?.company_name || 'Р').charAt(0).toUpperCase(),
              status: 'В сети', // Mock status
              lastSeen: 'Недавно',
              messages: []
            };
          }
          
          const messageTime = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          groupedChats[employerId].messages.push({
            id: msg.id,
            sender: msg.is_sender_employer ? 'them' : 'me',
            text: msg.text,
            time: messageTime
          });
        });

        const chatsArray = Object.values(groupedChats).sort((a: any, b: any) => {
          const lastMsgA = a.messages[a.messages.length - 1];
          const lastMsgB = b.messages[b.messages.length - 1];
          // Simple sort, assuming messages are already ordered by time
          return 0; 
        });

        setChats(chatsArray);
      } else {
        setChats([]);
      }
    } catch (err: any) {
      console.error('Error in fetchChats:', err);
      setError('Не удалось загрузить сообщения.');
    } finally {
      setIsLoading(false);
    }
  }

  const activeChatData = chats.find(c => c.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatData?.messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeChatData) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const messageObj = {
        employer_id: activeChatData.employer_id,
        seeker_id: user.id,
        text: newMessage,
        is_sender_employer: false
      };

      const { error } = await supabase
        .from('messages')
        .insert([messageObj]);

      if (error) throw error;
      
      fetchChats();
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Ошибка при отправке сообщения');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Сообщения</h1>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex">
        
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Поиск сообщений..." 
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : chats.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                У вас пока нет сообщений.
              </div>
            ) : (
              chats.map(chat => {
                const lastMessage = chat.messages?.[chat.messages.length - 1];
                const isActive = activeChatId === chat.id;
                
                return (
                  <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-4 border-b border-slate-200 cursor-pointer relative transition-colors ${isActive ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'}`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 border border-slate-200 rounded-md flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? 'bg-white text-slate-700' : 'bg-slate-50 text-slate-500'}`}>
                        {chat.initial || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h3 className={`text-sm truncate ${isActive ? 'font-bold text-slate-900' : 'font-medium text-slate-900'}`}>{chat.company}</h3>
                          <span className={`text-[10px] font-medium ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{chat.lastSeen}</span>
                        </div>
                        <p className={`text-xs truncate ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                          {lastMessage?.text || chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        {activeChatData ? (
          <div className="hidden md:flex flex-col flex-1 bg-white">
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-sm">
                  {activeChatData.initial || '?'}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{activeChatData.company}</h2>
                  <div className={`text-[10px] font-medium flex items-center gap-1 ${activeChatData.status === 'В сети' ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {activeChatData.status === 'В сети' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                    {activeChatData.status}
                  </div>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded hover:bg-slate-100">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              <div className="flex justify-center">
                <span className="text-[10px] font-medium text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">Сегодня</span>
              </div>

              {activeChatData.messages?.map((msg: any) => (
                <div key={msg.id} className={`flex gap-3 max-w-2xl ${msg.sender === 'me' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0 mt-1 ${msg.sender === 'me' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                    {msg.sender === 'me' ? 'А' : activeChatData.initial || '?'}
                  </div>
                  <div className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : ''}`}>
                    <div className={`p-3 rounded-lg shadow-sm text-sm whitespace-pre-wrap ${msg.sender === 'me' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                    <div className={`text-[10px] text-slate-500 mt-1 font-medium flex items-center gap-1 ${msg.sender === 'me' ? 'mr-1' : 'ml-1'}`}>
                      {msg.time} {msg.sender === 'me' && <CheckCircle2 className="w-3 h-3 text-slate-400" />}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex items-end gap-2 bg-white border border-slate-300 rounded-md p-1.5 focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900 transition-all">
                <button className="p-2 text-slate-400 hover:text-slate-700 transition-colors shrink-0 rounded hover:bg-slate-100">
                  <Paperclip className="w-4 h-4" />
                </button>
                <textarea 
                  rows={1}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напишите сообщение..." 
                  className="w-full bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-slate-900 outline-none max-h-32"
                ></textarea>
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col flex-1 bg-slate-50/50 items-center justify-center text-slate-500">
            <p>Выберите чат для начала общения</p>
          </div>
        )}
      </div>
    </div>
  );
}
