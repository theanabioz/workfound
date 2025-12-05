'use client';

import { useState } from 'react';
import { toggleSavedItem } from '@/lib/supabase-service';
import { Heart } from 'lucide-react';

interface SaveButtonProps {
  itemId: string;
  itemType: 'job' | 'resume';
  initialSaved?: boolean;
}

export function SaveButton({ itemId, itemType, initialSaved = false }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // Чтобы не переходить по ссылке карточки
    e.stopPropagation();
    
    setIsLoading(true);
    try {
      const newState = await toggleSavedItem(itemId, itemType);
      setIsSaved(newState);
    } catch (error) {
      console.error(error);
      alert('Пожалуйста, войдите в систему, чтобы сохранять вакансии.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors hover:bg-gray-100 ${
        isSaved ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
      }`}
      title={isSaved ? "Удалить из избранного" : "Сохранить"}
    >
      <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
    </button>
  );
}
