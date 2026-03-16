'use client';

import { useState, useRef, useEffect, useTransition } from 'react';
import { Filter, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { CATEGORIES, COUNTRIES, SALARY_OPTIONS, CONDITIONS, EMPLOYMENT_TYPES } from '@/utils/constants';

function FilterDropdown({ title, options, selected, onChange, isPending }: { title: string, options: string[], selected: string[], onChange: (val: string) => void, isPending: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className={`w-full flex items-center justify-between bg-white border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 outline-none transition-colors ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className="truncate">{selected.length > 0 ? `${title}: ${selected.length}` : title}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 shadow-lg z-20 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                // Keep dropdown open for multiple selections, or close it? 
                // Usually better to keep open for multiple
              }}
              className="w-full flex items-center justify-between px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 text-left"
            >
              {option}
              {selected.includes(option) && <Check className="w-4 h-4 text-zinc-900" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const getParamArray = (key: string) => searchParams.get(key)?.split(',').filter(Boolean) || [];

  const updateFilters = (key: string, values: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (values.length > 0) params.set(key, values.join(','));
    else params.delete(key);
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const toggleSelection = (key: string, list: string[], val: string) => {
    const newList = list.includes(val) ? list.filter(i => i !== val) : [...list, val];
    updateFilters(key, newList);
  };

  const resetFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-zinc-200 py-3 px-4 text-sm font-bold text-zinc-900 uppercase tracking-wider mb-6"
      >
        <Filter className="w-4 h-4" />
        {isOpen ? 'Скрыть фильтры' : 'Показать фильтры'}
      </button>

      <div className={`${isOpen ? 'block' : 'hidden'} md:block bg-white border border-zinc-200 p-6 sticky top-24`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-zinc-900 text-sm uppercase tracking-wider flex items-center gap-2">
            Фильтры
            {isPending && <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />}
          </h3>
          <button 
            onClick={resetFilters}
            className="text-[11px] text-zinc-500 font-medium hover:text-zinc-900 transition-colors uppercase tracking-wider"
          >
            Сбросить
          </button>
        </div>
        
        <div className="space-y-4">
          <FilterDropdown title="Специальность" options={CATEGORIES} selected={getParamArray('category')} onChange={(v) => toggleSelection('category', getParamArray('category'), v)} isPending={isPending} />
          <FilterDropdown title="Страна" options={COUNTRIES} selected={getParamArray('country')} onChange={(v) => toggleSelection('country', getParamArray('country'), v)} isPending={isPending} />
          <FilterDropdown title="Тип занятости" options={EMPLOYMENT_TYPES} selected={getParamArray('type')} onChange={(v) => toggleSelection('type', getParamArray('type'), v)} isPending={isPending} />
          <FilterDropdown title="Зарплата" options={SALARY_OPTIONS} selected={getParamArray('salary')} onChange={(v) => toggleSelection('salary', getParamArray('salary'), v)} isPending={isPending} />
          <FilterDropdown title="Условия" options={CONDITIONS} selected={getParamArray('condition')} onChange={(v) => toggleSelection('condition', getParamArray('condition'), v)} isPending={isPending} />
        </div>
      </div>
    </>
  );
}
