'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';

interface JobListContainerProps {
  children: ReactNode;
}

export default function JobListContainer({ children }: JobListContainerProps) {
  const searchParams = useSearchParams();
  const [prevParams, setPrevParams] = useState(searchParams.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  // Паттерн производного состояния: если параметры изменились, взводим флаг обновления
  if (searchParams.toString() !== prevParams) {
    setPrevParams(searchParams.toString());
    setIsUpdating(true);
  }

  // Сбрасываем флаг через задержку
  useEffect(() => {
    if (isUpdating) {
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isUpdating]);

  return (
    <div className="relative min-h-[600px]">
      <div className={`transition-opacity duration-300 ${isUpdating ? 'opacity-50' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}
