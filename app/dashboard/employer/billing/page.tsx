import { CheckCircle2, Zap, Star, Shield } from 'lucide-react';

export default function EmployerBillingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Платные услуги</h1>
        <p className="text-slate-500 mt-1 font-medium">Управление подпиской и лимитами вакансий</p>
      </div>

      {/* Current Status */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2">Текущий тариф</div>
            <h2 className="text-3xl font-extrabold mb-2">Стандартный</h2>
            <p className="text-slate-400">Действует до 15 Апреля 2026</p>
          </div>
          <div className="flex items-center gap-8 bg-white/10 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
            <div>
              <div className="text-4xl font-extrabold">3<span className="text-xl text-slate-400 font-medium">/5</span></div>
              <div className="text-sm text-slate-300 mt-1">Активных вакансий</div>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <div className="text-4xl font-extrabold">12</div>
              <div className="text-sm text-slate-300 mt-1">Открытий контактов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h3 className="text-xl font-bold text-slate-900 mb-6">Доступные тарифы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Basic */}
          <div className="bg-white rounded-3xl border border-slate-200/75 p-8 shadow-sm flex flex-col">
            <h4 className="text-xl font-bold text-slate-900 mb-2">Базовый</h4>
            <p className="text-slate-500 text-sm mb-6 h-10">Идеально для разового поиска сотрудников.</p>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">€49<span className="text-lg text-slate-500 font-medium">/мес</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>1 активная вакансия</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>До 10 открытий контактов</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Базовая поддержка</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              Выбрать тариф
            </button>
          </div>

          {/* Pro (Popular) */}
          <div className="bg-blue-600 rounded-3xl border border-blue-600 p-8 shadow-xl shadow-blue-600/20 flex flex-col relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-current" /> Популярный
            </div>
            <h4 className="text-xl font-bold text-white mb-2">Профессионал</h4>
            <p className="text-blue-100 text-sm mb-6 h-10">Для компаний с постоянной потребностью в кадрах.</p>
            <div className="text-4xl font-extrabold text-white mb-6">€149<span className="text-lg text-blue-200 font-medium">/мес</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <span>До 5 активных вакансий</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <span>Безлимитные контакты</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <span>Выделение вакансий цветом</span>
              </li>
              <li className="flex items-start gap-3 text-white">
                <CheckCircle2 className="w-5 h-5 text-blue-300 shrink-0 mt-0.5" />
                <span>Приоритетная поддержка</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold text-blue-600 bg-white hover:bg-slate-50 transition-colors shadow-sm">
              Текущий тариф
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-3xl border border-slate-200/75 p-8 shadow-sm flex flex-col">
            <h4 className="text-xl font-bold text-slate-900 mb-2">Корпоративный</h4>
            <p className="text-slate-500 text-sm mb-6 h-10">Максимальные возможности для крупных агентств.</p>
            <div className="text-4xl font-extrabold text-slate-900 mb-6">€399<span className="text-lg text-slate-500 font-medium">/мес</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Безлимитные вакансии</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Безлимитные контакты</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Премиум-размещение в топе</span>
              </li>
              <li className="flex items-start gap-3 text-slate-700">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span>Персональный менеджер</span>
              </li>
            </ul>
            <button className="w-full py-3 rounded-xl font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors">
              Выбрать тариф
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
