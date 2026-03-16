'use client';

import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check } from 'lucide-react';

const CATEGORIES = [
  'Строительство', 'Транспорт и логистика', 'Производство', 'IT', 'Медицина',
  'Туризм и гостиничный бизнес', 'Сельское хозяйство', 'Продажи', 'Финансы',
  'Образование', 'Административная работа', 'Рабочие специальности', 'Разнорабочие'
];

const COUNTRIES = [
  'Австрия', 'Албания', 'Андорра', 'Беларусь', 'Бельгия', 'Болгария', 'Босния и Герцеговина',
  'Великобритания', 'Венгрия', 'Германия', 'Греция', 'Дания', 'Ирландия', 'Исландия',
  'Испания', 'Италия', 'Кипр', 'Латвия', 'Литва', 'Лихтенштейн', 'Люксембург',
  'Мальта', 'Молдова', 'Монако', 'Нидерланды', 'Норвегия', 'Польша', 'Португалия',
  'Румыния', 'Сан-Марино', 'Сербия', 'Словакия', 'Словения', 'Украина', 'Финляндия',
  'Франция', 'Хорватия', 'Черногория', 'Чехия', 'Швеция', 'Швейцария', 'Эстония'
];

const SALARY_OPTIONS = ['Любая', 'от €1,500', 'от €2,000', 'от €2,500'];
const CONDITIONS = ['Жилье предоставляется', 'Без знания языка', 'Официальное оформление'];

const EMPLOYMENT_TYPES = ['Полная занятость', 'Частичная занятость', 'Контракт', 'Сезонная работа'];

function FilterDropdown({ title, options, selected, onChange }: { title: string, options: string[], selected: string[], onChange: (val: string) => void }) {
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
        className="w-full flex items-center justify-between bg-white border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:border-zinc-900 outline-none transition-colors"
      >
        <span className="truncate">{selected.length > 0 ? `${title}: ${selected.length}` : title}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 shadow-lg z-20 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
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
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSalaries, setSelectedSalaries] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);

  const toggleSelection = (list: string[], setList: (l: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter(i => i !== val) : [...list, val]);
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
        <h3 className="font-bold text-zinc-900 mb-6 flex items-center justify-between text-sm uppercase tracking-wider">
          Фильтры
          <button 
            onClick={() => { 
              setSelectedCategories([]); 
              setSelectedCountries([]); 
              setSelectedTypes([]); 
              setSelectedSalaries([]);
              setSelectedConditions([]);
            }}
            className="text-[11px] text-zinc-500 font-medium hover:text-zinc-900 transition-colors uppercase tracking-wider"
          >
            Сбросить
          </button>
        </h3>
        
        <div className="space-y-4">
          <FilterDropdown title="Специальность" options={CATEGORIES} selected={selectedCategories} onChange={(v) => toggleSelection(selectedCategories, setSelectedCategories, v)} />
          <FilterDropdown title="Страна" options={COUNTRIES} selected={selectedCountries} onChange={(v) => toggleSelection(selectedCountries, setSelectedCountries, v)} />
          <FilterDropdown title="Тип занятости" options={EMPLOYMENT_TYPES} selected={selectedTypes} onChange={(v) => toggleSelection(selectedTypes, setSelectedTypes, v)} />
          <FilterDropdown title="Зарплата" options={SALARY_OPTIONS} selected={selectedSalaries} onChange={(v) => toggleSelection(selectedSalaries, setSelectedSalaries, v)} />
          <FilterDropdown title="Условия" options={CONDITIONS} selected={selectedConditions} onChange={(v) => toggleSelection(selectedConditions, setSelectedConditions, v)} />
        </div>
      </div>
    </>
  );
}
