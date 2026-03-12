export default function JobFilters() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/75 p-6 sticky top-24 shadow-sm">
      <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between text-lg tracking-tight">
        Фильтры
        <button className="text-sm text-blue-600 font-medium hover:underline">Сбросить</button>
      </h3>
      
      <div className="space-y-8">
        {/* Category */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-3 uppercase tracking-wider">Специальность</h4>
          <div className="space-y-3">
            {['Водители', 'Строители', 'Склад / Логистика', 'Производство', 'Разнорабочие'].map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-3 uppercase tracking-wider">Страна</h4>
          <div className="space-y-3">
            {['Германия', 'Польша', 'Нидерланды', 'Чехия', 'Литва'].map((country) => (
              <label key={country} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-3 uppercase tracking-wider">Зарплата (в месяц)</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">Любая</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">от €1,500</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">от €2,000</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
              <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">от €2,500</span>
            </label>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h4 className="font-semibold text-sm text-slate-900 mb-3 uppercase tracking-wider">Условия</h4>
          <div className="space-y-3">
            {['Жилье предоставляется', 'Без знания языка', 'Официальное оформление'].map((cond) => (
              <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 w-4.5 h-4.5 transition-colors" />
                <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">{cond}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
