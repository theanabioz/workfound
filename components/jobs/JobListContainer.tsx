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

  // Сбрасываем флаг через небольшую задержку, чтобы эффект был виден
  useEffect(() => {
    if (isUpdating) {
      const timer = setTimeout(() => {
        setIsUpdating(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isUpdating]);

  return (
    <div className="relative min-h-[400px]">
      <AnimatePresence>
        {isUpdating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-zinc-50/40 backdrop-blur-[1px] flex items-start justify-center pt-20 pointer-events-none"
          >
            <div className="bg-white px-4 py-2 shadow-sm border border-zinc-200 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">Обновление...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${isUpdating ? 'opacity-50 grayscale-[0.5]' : 'opacity-100 grayscale-0'}`}>
        {children}
      </div>
    </div>
  );
}
