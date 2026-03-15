import { Search, Send, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';

export default function EmployerMessagesPage() {
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
            {/* Active Contact */}
            <div className="p-4 border-b border-slate-200 bg-slate-100 cursor-pointer relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-900"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-sm shrink-0">
                  А
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-bold text-slate-900 truncate">Алексей Смирнов</h3>
                    <span className="text-[10px] text-slate-500 font-medium">10:45</span>
                  </div>
                  <p className="text-xs text-slate-600 truncate">Добрый день! Да, конечно...</p>
                </div>
              </div>
            </div>

            {/* Other Contact */}
            <div className="p-4 border-b border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 border border-slate-200 text-slate-500 rounded-md flex items-center justify-center font-bold text-sm shrink-0">
                  И
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-sm font-medium text-slate-900 truncate">Иван Петров</h3>
                    <span className="text-[10px] text-slate-400 font-medium">Вчера</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">Спасибо за обратную связь.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-white">
          {/* Chat Header */}
          <div className="h-16 border-b border-slate-200 px-6 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-sm">
                А
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Алексей Смирнов</h2>
                <div className="text-xs text-slate-500">Водитель-дальнобойщик категории CE</div>
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

            {/* Sent Message */}
            <div className="flex gap-3 max-w-2xl ml-auto flex-row-reverse">
              <div className="w-8 h-8 bg-slate-900 text-white rounded-md flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                T
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-slate-900 text-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm">
                  <p>Здравствуйте, Алексей!</p>
                  <p className="mt-2">Мы рассмотрели ваше резюме на вакансию &quot;Водитель-дальнобойщик&quot;. Ваш опыт нам подходит. Готовы ли вы пройти небольшое собеседование по видеосвязи завтра в 14:00 по Варшаве?</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 mr-1 font-medium flex items-center gap-1">
                  10:42 <CheckCircle2 className="w-3 h-3 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Received Message */}
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 bg-white border border-slate-200 text-slate-700 rounded-md flex items-center justify-center font-bold text-sm shrink-0 mt-1">
                А
              </div>
              <div>
                <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-tl-none shadow-sm text-slate-800 text-sm">
                  <p>Добрый день! Да, конечно. Завтра в 14:00 мне удобно. В каком приложении будет звонок?</p>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 ml-1 font-medium">10:45</div>
              </div>
            </div>
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
              ></textarea>
              <button className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded transition-colors shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
