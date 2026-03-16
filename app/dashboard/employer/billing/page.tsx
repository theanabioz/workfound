'use client';

import { CheckCircle2, Zap, Star, Shield, CreditCard, Download, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function EmployerBillingPage() {
  const [currentPlan, setCurrentPlan] = useState('pro');
  const [isChangingPlan, setIsChangingPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePlanChange = (planId: string) => {
    setIsChangingPlan(planId);
    // Simulate API call
    setTimeout(() => {
      setCurrentPlan(planId);
      setIsChangingPlan(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 relative">
      {/* Success Toast */}
      <div 
        className={`fixed top-4 right-4 bg-zinc-900 border border-zinc-900 text-white px-4 py-3 flex items-center gap-3 transition-all duration-300 z-50 ${
          showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
        <div className="text-xs font-bold uppercase tracking-wider">Тариф успешно изменен</div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Биллинг и подписка</h1>
          <p className="text-sm text-zinc-500 mt-1 uppercase tracking-wider font-medium">Управление тарифом и лимитами аккаунта</p>
        </div>
        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white border border-zinc-200 text-zinc-700 text-xs font-bold uppercase tracking-wider hover:bg-zinc-50 transition-colors">
          <Download className="w-4 h-4" />
          Скачать акты
        </button>
      </div>

      {/* Current Status */}
      <div className="bg-white border border-zinc-200 overflow-hidden">
        <div className="border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <h2 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Текущее состояние</h2>
        </div>
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-zinc-900 tracking-tight">
                {currentPlan === 'basic' ? 'Базовый тариф' : currentPlan === 'pro' ? 'Профессионал' : 'Корпоративный'}
              </h3>
              <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border bg-zinc-900 text-white border-zinc-900">
                Активен
              </span>
            </div>
            <p className="text-sm text-zinc-500 font-medium">
              Следующий платеж: 15 Апреля 2026 ({currentPlan === 'basic' ? '€49.00' : currentPlan === 'pro' ? '€149.00' : '€399.00'})
            </p>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <div className="text-3xl font-mono font-medium text-zinc-900">
                3<span className="text-xl text-zinc-400">/{currentPlan === 'basic' ? '1' : currentPlan === 'pro' ? '5' : '∞'}</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Активных вакансий</div>
            </div>
            <div className="w-px h-12 bg-zinc-200"></div>
            <div className="text-right">
              <div className="text-3xl font-mono font-medium text-zinc-900">
                12<span className="text-xl text-zinc-400">{currentPlan === 'basic' ? '/10' : ''}</span>
              </div>
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">Открытий контактов</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div>
        <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Доступные тарифы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Basic */}
          <div className={`bg-white p-8 flex flex-col relative transition-all ${currentPlan === 'basic' ? 'border-2 border-zinc-900' : 'border border-zinc-200'}`}>
            {currentPlan === 'basic' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" /> Текущий
              </div>
            )}
            <h4 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">Базовый</h4>
            <p className="text-zinc-500 text-sm mb-6 h-10 font-medium">Идеально для разового поиска сотрудников.</p>
            <div className="text-4xl font-mono font-medium text-zinc-900 mb-8">€49<span className="text-sm text-zinc-500 font-normal">/мес</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>1 активная вакансия</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>До 10 открытий контактов</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Базовая поддержка</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanChange('basic')}
              disabled={currentPlan === 'basic' || isChangingPlan !== null}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                currentPlan === 'basic' 
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {isChangingPlan === 'basic' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Обработка...</>
              ) : currentPlan === 'basic' ? (
                'Активен'
              ) : (
                'Выбрать тариф'
              )}
            </button>
          </div>

          {/* Pro (Popular) */}
          <div className={`bg-white p-8 flex flex-col relative transition-all ${currentPlan === 'pro' ? 'border-2 border-zinc-900' : 'border border-zinc-200'}`}>
            {currentPlan === 'pro' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" /> Текущий
              </div>
            )}
            <h4 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">Профессионал</h4>
            <p className="text-zinc-500 text-sm mb-6 h-10 font-medium">Для компаний с постоянной потребностью в кадрах.</p>
            <div className="text-4xl font-mono font-medium text-zinc-900 mb-8">€149<span className="text-sm text-zinc-500 font-normal">/мес</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>До 5 активных вакансий</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Безлимитные контакты</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Выделение вакансий цветом</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Приоритетная поддержка</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanChange('pro')}
              disabled={currentPlan === 'pro' || isChangingPlan !== null}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                currentPlan === 'pro' 
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {isChangingPlan === 'pro' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Обработка...</>
              ) : currentPlan === 'pro' ? (
                'Активен'
              ) : (
                'Выбрать тариф'
              )}
            </button>
          </div>

          {/* Enterprise */}
          <div className={`bg-white p-8 flex flex-col relative transition-all ${currentPlan === 'enterprise' ? 'border-2 border-zinc-900' : 'border border-zinc-200'}`}>
            {currentPlan === 'enterprise' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-3 h-3 fill-current" /> Текущий
              </div>
            )}
            <h4 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight">Корпоративный</h4>
            <p className="text-zinc-500 text-sm mb-6 h-10 font-medium">Максимальные возможности для крупных агентств.</p>
            <div className="text-4xl font-mono font-medium text-zinc-900 mb-8">€399<span className="text-sm text-zinc-500 font-normal">/мес</span></div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Безлимитные вакансии</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Безлимитные контакты</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Премиум-размещение в топе</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-zinc-700 font-medium">
                <CheckCircle2 className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>Персональный менеджер</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanChange('enterprise')}
              disabled={currentPlan === 'enterprise' || isChangingPlan !== null}
              className={`w-full py-3 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                currentPlan === 'enterprise' 
                  ? 'bg-zinc-900 text-white hover:bg-zinc-800' 
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              {isChangingPlan === 'enterprise' ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Обработка...</>
              ) : currentPlan === 'enterprise' ? (
                'Активен'
              ) : (
                'Выбрать тариф'
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
