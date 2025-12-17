'use client';

import { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { FilterContent } from './FilterContent';

export function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden bg-white border-b border-gray-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-sm font-medium text-gray-900"
      >
        <span className="flex items-center gap-2">
          <Filter className="w-4 h-4" /> Фильтры
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      
      {isOpen && (
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 animate-in slide-in-from-top-2">
          <FilterContent />
        </div>
      )}
    </div>
  );
}
