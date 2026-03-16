'use client';

import { useState } from 'react';
import ApplyModal from './ApplyModal';

interface ApplyButtonProps {
  jobId: string;
  jobTitle: string;
  employerId: string;
}

export default function ApplyButton({ jobId, jobTitle, employerId }: ApplyButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3.5 font-medium transition-colors w-full text-center block"
      >
        Откликнуться
      </button>

      <ApplyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={jobId}
        jobTitle={jobTitle}
        employerId={employerId}
      />
    </>
  );
}
