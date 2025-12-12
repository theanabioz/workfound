'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

const COUNTRIES = [
  { code: 'all', name: 'Все страны' },
  { code: 'de', name: 'Германия' },
  { code: 'pl', name: 'Польша' },
  { code: 'lt', name: 'Литва' },
  { code: 'nl', name: 'Нидерланды' },
  { code: 'ee', name: 'Эстония' },
  { code: 'cz', name: 'Чехия' },
];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [countryCode, setCountryCode] = useState(searchParams.get('country') || 'all');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [salary, setSalary] = useState(searchParams.get('minSalary') || '');
  const [salaryPeriod, setSalaryPeriod] = useState(searchParams.get('salaryPeriod') || 'month');

  // Debounce update
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const oldQuery = params.toString();

      if (countryCode && countryCode !== 'all') params.set('country', countryCode);
      else params.delete('country');

      if (city) params.set('city', city);
      else params.delete('city');

      if (salary) params.set('minSalary', salary);
      else params.delete('minSalary');

      if (salaryPeriod) params.set('salaryPeriod', salaryPeriod);

      const newQuery = params.toString();

      if (oldQuery !== newQuery) {
        router.push(`/?${newQuery}`);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [countryCode, city, salary, salaryPeriod]); // Add salaryPeriod to deps

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <span className="font-semibold text-sm">Фильтры</span>
        <Filter className="w-4 h-4 text-gray-400" />
      </div>

      {/* Location */}
      <div className="space-y-3">
        <label className="text-sm font-medium leading-none text-gray-700">Локация</label>
        <div className="space-y-2">
          <select 
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
          <input 
            type="text" 
            placeholder="Город (напр. Берлин)" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900"
          />
        </div>
      </div>

      {/* Salary */}
      <div className="space-y-3">
        <label className="text-sm font-medium leading-none text-gray-700">Зарплата</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
            <input 
              type="number" 
              placeholder="От" 
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-200 bg-transparent pl-8 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-900"
            />
          </div>
          <select
            value={salaryPeriod}
            onChange={(e) => setSalaryPeriod(e.target.value)}
            className="flex h-9 w-24 items-center justify-between rounded-md border border-gray-200 bg-transparent px-2 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-900"
          >
            <option value="month">/ мес</option>
            <option value="hour">/ час</option>
            <option value="year">/ год</option>
          </select>
        </div>
      </div>

      {/* Benefits */}
      <div className="space-y-3">
        <label className="text-sm font-medium leading-none text-gray-700">Компания предлагает</label>
        <div className="space-y-2">
          {['Жилье', 'Визовая поддержка', 'Обучение'].map((label, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <input type="checkbox" id={`b-${idx}`} className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black" />
              <label htmlFor={`b-${idx}`} className="text-sm font-medium leading-none text-gray-600">{label}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}