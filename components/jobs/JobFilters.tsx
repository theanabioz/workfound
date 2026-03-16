export default function JobFilters() {
  return (
    <div className="bg-white border border-zinc-200 p-6 sticky top-24">
      <h3 className="font-bold text-zinc-900 mb-6 flex items-center justify-between text-sm uppercase tracking-wider">
        Фильтры
        <button className="text-[11px] text-zinc-500 font-medium hover:text-zinc-900 transition-colors uppercase tracking-wider">Сбросить</button>
      </h3>
      
      <div className="space-y-8">
        {/* Category */}
        <div>
          <h4 className="font-semibold text-[11px] text-zinc-900 mb-3 uppercase tracking-wider">Специальность</h4>
          <div className="space-y-3">
            {['Водители', 'Строители', 'Склад / Логистика', 'Производство', 'Разнорабочие'].map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Country */}
        <div>
          <h4 className="font-semibold text-[11px] text-zinc-900 mb-3 uppercase tracking-wider">Страна</h4>
          <div className="space-y-3">
            {['Германия', 'Польша', 'Нидерланды', 'Чехия', 'Литва'].map((country) => (
              <label key={country} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{country}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <h4 className="font-semibold text-[11px] text-zinc-900 mb-3 uppercase tracking-wider">Зарплата (в месяц)</h4>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">Любая</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">от €1,500</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">от €2,000</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="salary" className="border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">от €2,500</span>
            </label>
          </div>
        </div>

        {/* Conditions */}
        <div>
          <h4 className="font-semibold text-[11px] text-zinc-900 mb-3 uppercase tracking-wider">Условия</h4>
          <div className="space-y-3">
            {['Жилье предоставляется', 'Без знания языка', 'Официальное оформление'].map((cond) => (
              <label key={cond} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="rounded-none border-zinc-300 text-zinc-900 focus:ring-zinc-900 w-4 h-4 transition-colors" />
                <span className="text-sm text-zinc-600 group-hover:text-zinc-900 transition-colors">{cond}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
