'use client';

import { Filter } from 'lucide-react';
import { FilterContent } from './FilterContent';

export function FilterBar() {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <span className="font-semibold text-sm">Фильтры</span>
        <Filter className="w-4 h-4 text-gray-400" />
      </div>
      <FilterContent />
    </div>
  );
}
