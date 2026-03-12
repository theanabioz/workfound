import { Save, Plus, Trash2, User, MapPin, Phone, Mail, Briefcase, GraduationCap, Languages } from 'lucide-react';

export default function ResumePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Мое резюме</h1>
        <p className="text-slate-500 mt-1 font-medium">Заполните профиль, чтобы работодатели могли вас найти</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Basic Info */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Имя и Фамилия</label>
                <input type="text" defaultValue="Алексей Смирнов" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Желаемая должность</label>
                <input type="text" defaultValue="Водитель-дальнобойщик CE" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Телефон</label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="tel" defaultValue="+48 123 456 789" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="email" defaultValue="alex.smirnov@example.com" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Текущее местоположение</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="text" defaultValue="Варшава, Польша" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-2">О себе</label>
                <textarea rows={4} defaultValue="Опыт работы по Европе более 5 лет. Есть чип-карта, код 95, ADR базовый. Без вредных привычек, ответственный." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Experience */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Опыт работы
              </h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 relative group">
                <button className="absolute top-4 right-4 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Должность</label>
                    <div className="font-bold text-slate-900">Водитель CE</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Компания</label>
                    <div className="font-bold text-slate-900">EuroTrans Sp. z o.o.</div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Период</label>
                    <div className="font-medium text-slate-700">Март 2020 — Настоящее время</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Languages */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Languages className="w-5 h-5 text-blue-600" />
                Знание языков
              </h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <Plus className="w-4 h-4" /> Добавить
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-900">Русский</span>
                <span className="text-slate-500 text-sm">— Родной</span>
                <button className="ml-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-900">Польский</span>
                <span className="text-slate-500 text-sm">— B1 (Средний)</span>
                <button className="ml-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                <span className="font-semibold text-slate-900">Английский</span>
                <span className="text-slate-500 text-sm">— A2 (Базовый)</span>
                <button className="ml-2 text-slate-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </section>

        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>
  );
}
