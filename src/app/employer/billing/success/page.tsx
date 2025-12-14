import Link from 'next/link';
import { promoteJob } from '@/lib/supabase-service';
import { CheckCircle } from 'lucide-react';

export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string; job_id: string; plan_id: string }>;
}) {
  const params = await searchParams;
  const { job_id, plan_id } = params;

  // В реальности тут надо проверить session_id через Stripe API
  if (job_id && plan_id) {
    await promoteJob(job_id, plan_id);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Оплата успешна!</h1>
        <p className="text-gray-600 mb-8">
          Ваша вакансия успешно продвинута. Эффект вступит в силу мгновенно.
        </p>
        <Link 
          href="/employer/jobs"
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          Вернуться к вакансиям
        </Link>
      </div>
    </div>
  );
}
