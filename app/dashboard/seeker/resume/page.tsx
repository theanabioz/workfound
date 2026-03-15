import { Save, Plus, Trash2, User, MapPin, Phone, Mail, Briefcase, GraduationCap, Languages } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Мое резюме</h1>
        <p className="text-sm text-slate-500 mt-1">Заполните профиль, чтобы работодатели могли вас найти</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Basic Info */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Имя и Фамилия</label>
                <input type="text" defaultValue="Алексей Смирнов" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Желаемая должность</label>
                <input type="text" defaultValue="Водитель-дальнобойщик CE" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Телефон</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="tel" defaultValue="+48 123 456 789" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="email" defaultValue="alex.smirnov@example.com" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Текущее местоположение</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" defaultValue="Варшава, Польша" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">О себе</label>
                <textarea rows={4} defaultValue="Опыт работы по Европе более 5 лет. Есть чип-карта, код 95, ADR базовый. Без вредных привычек, ответственный." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Experience */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" />
                Опыт работы
              </h2>
              <button className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                <Plus className="w-3 h-3" /> Добавить
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="p-4 border border-slate-200 rounded-lg bg-white relative group">
                <button className="absolute top-3 right-3 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Должность</label>
                    <div className="text-sm font-medium text-slate-900">Водитель CE</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Компания</label>
                    <div className="text-sm font-medium text-slate-900">EuroTrans Sp. z o.o.</div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Период</label>
                    <div className="text-sm text-slate-600">Март 2020 — Настоящее время</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Languages */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Languages className="w-4 h-4 text-slate-400" />
                Знание языков
              </h2>
              <button className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors">
                <Plus className="w-3 h-3" /> Добавить
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm">
                <span className="font-medium text-slate-900">Русский</span>
                <span className="text-slate-500 text-xs">— Родной</span>
                <button className="ml-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm">
                <span className="font-medium text-slate-900">Польский</span>
                <span className="text-slate-500 text-xs">— B1 (Средний)</span>
                <button className="ml-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-slate-200 text-sm">
                <span className="font-medium text-slate-900">Английский</span>
                <span className="text-slate-500 text-xs">— A2 (Базовый)</span>
                <button className="ml-1 text-slate-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </section>

        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
