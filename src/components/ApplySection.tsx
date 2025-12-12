'use client';

import { useState } from 'react';
import { ApplyModal } from './ApplyModal';

interface ApplySectionProps {
  jobId: string;
  jobTitle: string;
  contactInfo?: string;
  isDirect: boolean;
}

export function ApplySection({ jobId, jobTitle, contactInfo, isDirect }: ApplySectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isDirect) {
    return (
      <div className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold flex-1 md:flex-none text-center shadow-lg shadow-blue-200 cursor-default">
        {contactInfo}
      </div>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-black text-white px-8 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-colors flex-1 md:flex-none text-center shadow-lg shadow-gray-200"
      >
        Откликнуться
      </button>

      {isOpen && (
        <ApplyModal 
          jobId={jobId} 
          jobTitle={jobTitle} 
          onClose={() => setIsOpen(false)} 
        />
      )}
    </>
  );
}
