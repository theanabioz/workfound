import { Search, Send, Paperclip, MoreVertical, CheckCircle2 } from 'lucide-react';

export default function EmployerMessagesPage() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Сообщения</h1>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden flex">
        
        {/* Contacts Sidebar */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Поиск кандидатов..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {/* Active Contact */}
            <div className="p-4 border-b border-slate-100 bg-white cursor-pointer relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  А
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900 truncate">Алексей Смирнов</h3>
                    <span className="text-xs text-slate-400 font-medium">10:45</span>
                  </div>
                  <p className="text-sm text-slate-600 truncate">Добрый день! Да, конечно...</p>
                </div>
              </div>
            </div>

            {/* Other Contact */}
            <div className="p-4 border-b border-slate-100 hover:bg-white cursor-pointer transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                  И
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-slate-900 truncate">Иван Петров</h3>
                    <span className="text-xs text-slate-400 font-medium">Вчера</span>
                  </div>
                  <p className="text-sm text-slate-500 truncate">Спасибо за обратную связь.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-col flex-1 bg-white">
          {/* Chat Header */}
          <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold">
                А
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Алексей Смирнов</h2>
                <div className="text-xs text-slate-500 font-medium">Водитель-дальнобойщик категории CE</div>
              </div>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            <div className="flex justify-center">
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Сегодня</span>
            </div>

            {/* Sent Message */}
            <div className="flex gap-4 max-w-2xl ml-auto flex-row-reverse">
              <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold shrink-0 mt-1">
                T
              </div>
              <div className="flex flex-col items-end">
                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm">
                  <p>Здравствуйте, Алексей!</p>
                  <p className="mt-2">Мы рассмотрели ваше резюме на вакансию &quot;Водитель-дальнобойщик&quot;. Ваш опыт нам подходит. Готовы ли вы пройти небольшое собеседование по видеосвязи завтра в 14:00 по Варшаве?</p>
                </div>
                <div className="text-xs text-slate-400 mt-1.5 mr-1 font-medium flex items-center gap-1">
                  10:42 <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Received Message */}
            <div className="flex gap-4 max-w-2xl">
              <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold shrink-0 mt-1">
                А
              </div>
              <div>
                <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none shadow-sm text-slate-700">
                  <p>Добрый день! Да, конечно. Завтра в 14:00 мне удобно. В каком приложении будет звонок?</p>
                </div>
                <div className="text-xs text-slate-400 mt-1.5 ml-1 font-medium">10:45</div>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              <textarea 
                rows={1}
                placeholder="Напишите сообщение..." 
                className="w-full bg-transparent border-none focus:ring-0 resize-none py-2 text-slate-700 outline-none max-h-32"
              ></textarea>
              <button className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shrink-0 shadow-sm shadow-blue-600/20">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
