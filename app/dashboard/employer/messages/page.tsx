'use client';

import { Search, Send, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function EmployerMessagesPage() {
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      name: 'Алексей Смирнов',
      job: 'Водитель-дальнобойщик категории CE',
      lastMessage: 'Добрый день! Да, конечно...',
      time: '10:45',
      unread: 0,
      messages: [
        { id: 1, text: 'Здравствуйте, Алексей!\n\nМы рассмотрели ваше резюме на вакансию "Водитель-дальнобойщик". Ваш опыт нам подходит. Готовы ли вы пройти небольшое собеседование по видеосвязи завтра в 14:00 по Варшаве?', time: '10:42', isSender: true },
        { id: 2, text: 'Добрый день! Да, конечно. Завтра в 14:00 мне удобно. В каком приложении будет звонок?', time: '10:45', isSender: false },
      ]
    },
    {
      id: 2,
      name: 'Иван Петров',
      job: 'Сварщик MIG/MAG',
      lastMessage: 'Спасибо за обратную связь.',
      time: 'Вчера',
      unread: 0,
      messages: [
        { id: 1, text: 'Иван, к сожалению, на данный момент мы выбрали другого кандидата. Спасибо за интерес к нашей компании.', time: 'Вчера, 15:30', isSender: true },
        { id: 2, text: 'Спасибо за обратную связь.', time: 'Вчера, 16:00', isSender: false },
      ]
    }
  ]);

  const activeChat = chats.find(chat => chat.id === activeChatId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChat) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSender: true
    };

    setChats(chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: messageInput,
          time: newMessage.time,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));

    setMessageInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
                placeholder="Поиск кандидатов..." 
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none text-sm transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-4 border-b border-slate-200 cursor-pointer transition-colors relative ${activeChatId === chat.id ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'}`}
              >
                {activeChatId === chat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>}
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 border text-slate-700 rounded-md flex items-center justify-center font-bold text-sm shrink-0 ${activeChatId === chat.id ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    {chat.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`text-sm truncate ${activeChatId === chat.id ? 'font-bold text-slate-900' : 'font-medium text-slate-900'}`}>
                        {chat.name}
                      </h3>
                      <span className={`text-[10px] font-medium ${activeChatId === chat.id ? 'text-slate-500' : 'text-slate-400'}`}>
                        {chat.time}
                      </span>
                    </div>
                    <p className={`text-xs truncate ${activeChatId === chat.id ? 'text-slate-600' : 'text-slate-500'}`}>
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-white">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-sm">
                    {activeChat.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">{activeChat.name}</h2>
                    <div className="text-xs text-slate-500">{activeChat.job}</div>
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

                {activeChat.messages.map((message) => (
                  <div key={message.id} className={`flex gap-3 max-w-2xl ${message.isSender ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0 mt-1 ${message.isSender ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                      {message.isSender ? 'T' : activeChat.name.charAt(0)}
                    </div>
                    <div className={`flex flex-col ${message.isSender ? 'items-end' : 'items-start'}`}>
                      <div className={`p-3 rounded-lg shadow-sm text-sm whitespace-pre-wrap ${message.isSender ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'}`}>
                        {message.text}
                      </div>
                      <div className={`text-[10px] text-slate-500 mt-1 font-medium flex items-center gap-1 ${message.isSender ? 'mr-1' : 'ml-1'}`}>
                        {message.time} {message.isSender && <CheckCircle2 className="w-3 h-3 text-slate-400" />}
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
                    placeholder="Напишите сообщение..." 
                    className="w-full bg-transparent border-none focus:ring-0 resize-none py-2 text-sm text-slate-900 outline-none max-h-32"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                  ></textarea>
                  <button 
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded transition-colors shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Выберите чат для начала общения
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
