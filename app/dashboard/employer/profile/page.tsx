'use client';

import { Save, Building, MapPin, Globe, Mail, Phone, UploadCloud, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function EmployerProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Профиль компании</h1>
        <p className="text-sm text-slate-500 mt-1">Информация о вашей компании для соискателей</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden relative">
        {/* Success Toast */}
        <div 
          className={`absolute top-4 right-4 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-sm flex items-center gap-3 transition-all duration-300 z-50 ${
            showSuccess ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <div className="text-sm font-medium">Профиль успешно обновлен</div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Logo & Cover */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Логотип компании</h2>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:bg-slate-100 hover:border-slate-400 transition-colors cursor-pointer">
                <UploadCloud className="w-6 h-6 mb-1 text-slate-400" />
                <span className="text-[10px] font-medium uppercase tracking-wider">Загрузить</span>
              </div>
              <div className="text-sm text-slate-500">
                <p className="font-medium text-slate-700 mb-1">Рекомендуемый размер: 400x400px</p>
                <p>Форматы: JPG, PNG. Максимальный вес: 2MB.</p>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Basic Info */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Название компании</label>
                <input type="text" defaultValue="TransLogistics GmbH" className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Отрасль</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm appearance-none">
                  <option>Транспорт и логистика</option>
                  <option>Строительство</option>
                  <option>Производство</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Размер компании</label>
                <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm appearance-none">
                  <option>50-200 сотрудников</option>
                  <option>1-10 сотрудников</option>
                  <option>10-50 сотрудников</option>
                  <option>Более 200 сотрудников</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Описание компании</label>
                <textarea rows={5} defaultValue="Ведущая логистическая компания в Германии. Мы занимаемся международными перевозками по всей Европе более 15 лет. В нашем автопарке современные тягачи стандарта Евро-6." className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-200" />

          {/* Contacts */}
          <section>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Контакты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Штаб-квартира (Адрес)</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="text" defaultValue="Мюнхен, Германия" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Сайт</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="url" defaultValue="https://translogistics.de" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Email для соискателей</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input type="email" defaultValue="hr@translogistics.de" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-colors text-sm" />
                </div>
              </div>
            </div>
          </section>

        </div>
        
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </div>
  );
}
