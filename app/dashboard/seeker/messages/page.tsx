'use client';

import { Search, Send, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState([
    {
      id: 1,
      company: 'BuildEuro Sp. z o.o.',
      initial: 'B',
      status: 'В сети',
      lastSeen: '10:42',
      messages: [
        { id: 1, sender: 'them', text: 'Здравствуйте, Алексей!\n\nМы рассмотрели ваше резюме на вакансию "Строитель-универсал". Ваш опыт нам подходит. Готовы ли вы пройти небольшое собеседование по видеосвязи завтра в 14:00 по Варшаве?', time: '10:42' },
        { id: 2, sender: 'me', text: 'Добрый день! Да, конечно. Завтра в 14:00 мне удобно. В каком приложении будет звонок?', time: '10:45' }
      ]
    },
    {
      id: 2,
      company: 'TransLogistics GmbH',
      initial: 'T',
      status: 'Был(а) недавно',
      lastSeen: 'Вчера',
      messages: [
        { id: 1, sender: 'them', text: 'Ваше резюме получено. Мы свяжемся с вами в ближайшее время.', time: 'Вчера, 15:30' }
      ]
    }
  ]);

  const activeChatData = chats.find(c => c.id === activeChat);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChatData?.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setChats(chats.map(chat => {
      if (chat.id === activeChat) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            { id: Date.now(), sender: 'me', text: newMessage.trim(), time: timeString }
          ]
        };
      }
      return chat;
    }));

    setNewMessage('');
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
            {chats.map(chat => {
              const lastMessage = chat.messages[chat.messages.length - 1];
              const isActive = activeChat === chat.id;
              
              return (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat.id)}
                  className={`p-4 border-b border-slate-200 cursor-pointer relative transition-colors ${isActive ? 'bg-slate-100' : 'bg-white hover:bg-slate-50'}`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>}
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 border border-slate-200 rounded-md flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? 'bg-white text-slate-700' : 'bg-slate-50 text-slate-500'}`}>
                      {chat.initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-0.5">
                        <h3 className={`text-sm truncate ${isActive ? 'font-bold text-slate-900' : 'font-medium text-slate-900'}`}>{chat.company}</h3>
                        <span className={`text-[10px] font-medium ${isActive ? 'text-slate-500' : 'text-slate-400'}`}>{chat.lastSeen}</span>
                      </div>
                      <p className={`text-xs truncate ${isActive ? 'text-slate-600' : 'text-slate-500'}`}>
                        {lastMessage.text}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        {activeChatData ? (
          <div className="hidden md:flex flex-col flex-1 bg-white">
            {/* Chat Header */}
            <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-sm">
                  {activeChatData.initial}
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

              {activeChatData.messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 max-w-2xl ${msg.sender === 'me' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm shrink-0 mt-1 ${msg.sender === 'me' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                    {msg.sender === 'me' ? 'А' : activeChatData.initial}
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
