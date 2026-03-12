import { Save, Building, MapPin, Globe, Mail, Phone, UploadCloud } from 'lucide-react';

export default function EmployerProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Профиль компании</h1>
        <p className="text-slate-500 mt-1 font-medium">Информация о вашей компании для соискателей</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/75 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Logo & Cover */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Логотип компании</h2>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-slate-100 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 hover:border-blue-400 transition-colors cursor-pointer">
                <UploadCloud className="w-8 h-8 mb-1 text-slate-400" />
                <span className="text-xs font-semibold">Загрузить</span>
              </div>
              <div className="text-sm text-slate-500">
                <p className="font-medium text-slate-700 mb-1">Рекомендуемый размер: 400x400px</p>
                <p>Форматы: JPG, PNG. Максимальный вес: 2MB.</p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Basic Info */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Основная информация
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Название компании</label>
                <input type="text" defaultValue="TransLogistics GmbH" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Отрасль</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none">
                  <option>Транспорт и логистика</option>
                  <option>Строительство</option>
                  <option>Производство</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Размер компании</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors appearance-none">
                  <option>50-200 сотрудников</option>
                  <option>1-10 сотрудников</option>
                  <option>10-50 сотрудников</option>
                  <option>Более 200 сотрудников</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Описание компании</label>
                <textarea rows={5} defaultValue="Ведущая логистическая компания в Германии. Мы занимаемся международными перевозками по всей Европе более 15 лет. В нашем автопарке современные тягачи стандарта Евро-6." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"></textarea>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          {/* Contacts */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Контакты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-900 mb-2">Штаб-квартира (Адрес)</label>
                <div className="relative">
                  <MapPin className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="text" defaultValue="Мюнхен, Германия" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Сайт</label>
                <div className="relative">
                  <Globe className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="url" defaultValue="https://translogistics.de" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Email для соискателей</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                  <input type="email" defaultValue="hr@translogistics.de" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors" />
                </div>
              </div>
            </div>
          </section>

        </div>
        
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Сохранить профиль
          </button>
        </div>
      </div>
    </div>
  );
}
