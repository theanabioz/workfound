import Link from 'next/link';
import { processDeposit, getCurrentCompany } from '@/lib/supabase-service';
import { CheckCircle } from 'lucide-react';

export default async function DepositSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id: string; amount: string }>;
}) {
  const params = await searchParams;
  const { session_id, amount } = params;
  const company = await getCurrentCompany();

  if (company && session_id) {
    await processDeposit(company.id, parseInt(amount), session_id);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-12 rounded-2xl shadow-lg text-center max-w-md">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Баланс пополнен!</h1>
        <p className="text-gray-600 mb-8">
          Средства успешно зачислены на счет компании.
        </p>
        <Link 
          href="/employer/billing"
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          В кошелек
        </Link>
      </div>
    </div>
  );
}
