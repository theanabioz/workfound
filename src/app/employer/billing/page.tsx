'use client';

import { useState, useEffect } from 'react';
import { getCompanyBalance, getTransactions, Transaction, Job, promoteJob, spendBalance } from '@/lib/supabase-service';
import { Wallet, Plus, CreditCard, Zap, Star, LayoutList, CheckCircle, Calendar } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getMyCompanyJobsAction } from './actions';

export default function BillingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initial State from URL
  const initialTab = searchParams.get('tab') === 'services' ? 'services' : 'wallet';
  const initialJobId = searchParams.get('jobId') || '';

  const [activeTab, setActiveTab] = useState<'wallet' | 'services'>(initialTab);
  
  // Wallet
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositLoading, setDepositLoading] = useState(false);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Services Config
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  
  const [serviceType, setServiceType] = useState<'highlight' | 'top'>('highlight');
  const [duration, setDuration] = useState<number>(7); 
  
  const [isPromoting, setIsPromoting] = useState(false);

  const PRICES = {
    highlight: 100, 
    top: 300       
  };

  const totalPrice = PRICES[serviceType] * duration;

  useEffect(() => {
    const load = async () => {
      const [bal, txs] = await Promise.all([getCompanyBalance(), getTransactions()]);
      setBalance(bal);
      setTransactions(txs);
      setLoading(false);
    };
    load();
  }, []);

  // Fetch jobs if services tab is active OR if we have initialJobId (to show correct name)
  useEffect(() => {
    if (activeTab === 'services' || initialJobId) {
      getMyCompanyJobsAction().then(data => {
        setJobs(data);
        // Ensure selectedJobId is valid
        if (initialJobId && data.find(j => j.id === initialJobId)) {
            setSelectedJobId(initialJobId);
        }
      });
    }
  }, [activeTab, initialJobId]);

  // Sync tab state with URL (optional, but good for UX)
  const handleTabChange = (tab: 'wallet' | 'services') => {
    setActiveTab(tab);
    router.replace('/employer/billing');
  };

  const handleDeposit = async () => {
    const amount = parseFloat(customAmount);
    if (!amount || amount < 5) return alert('Минимальная сумма пополнения — 5 €');

    setDepositLoading(true);
    try {
      const response = await fetch('/api/stripe/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100) }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (e) {
      console.error(e);
      alert('Ошибка');
    } finally {
      setDepositLoading(false);
    }
  };

  const handleBuyService = async () => {
    if (!selectedJobId) return alert('Выберите вакансию');
    if (balance < totalPrice) return alert('Недостаточно средств. Пополните кошелек.');
    if (!confirm(`Списать ${(totalPrice / 100).toFixed(2)} €?`)) return;

    setIsPromoting(true);
    try {
      const success = await spendBalance(totalPrice, `Продвижение: ${serviceType === 'top' ? 'ТОП' : 'Highlight'} на ${duration} дн.`);
      if (success) {
        await promoteJob(selectedJobId, serviceType === 'top' ? 'top_7' : 'highlight'); 
        alert('Услуга активирована!');
        const bal = await getCompanyBalance();
        setBalance(bal);
        // Clear selection
        setSelectedJobId('');
      } else {
        alert('Ошибка списания');
      }
    } catch (e) {
      console.error(e);
      alert('Ошибка');
    } finally {
      setIsPromoting(false);
    }
  };

  if (loading) return <div className="p-8">Загрузка...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Финансы и Услуги</h1>
          <div className="text-right">
            <span className="text-xs text-gray-500 uppercase font-bold mr-2">Баланс:</span>
            <span className="text-xl font-bold text-gray-900">{(balance / 100).toFixed(2)} €</span>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => handleTabChange('wallet')}
            className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'wallet' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            <Wallet className="w-4 h-4" /> Кошелек
          </button>
          <button
            onClick={() => handleTabChange('services')}
            className={`pb-3 px-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              activeTab === 'services' ? 'border-b-2 border-black text-black' : 'text-gray-500 hover:text-black'
            }`}
          >
            <LayoutList className="w-4 h-4" /> Каталог услуг
          </button>
        </div>

        {activeTab === 'wallet' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Balance Card */}
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Текущий баланс</span>
                  <Wallet className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  {(balance / 100).toFixed(2)} €
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Пополнить счет</p>
                  
                  {/* Preset Buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[10, 20, 50, 100].map(amount => (
                      <button
                        key={amount}
                        onClick={() => setCustomAmount(amount.toString())}
                        className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                          customAmount === amount.toString() 
                            ? 'border-black bg-black text-white' 
                            : 'border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {amount}€
                      </button>
                    ))}
                  </div>

                  {/* Custom Input & Action */}
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-gray-500 text-sm">€</span>
                      <input 
                        type="number" 
                        min="5"
                        placeholder="Сумма" 
                        className="w-full pl-7 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-black focus:border-black text-sm"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleDeposit}
                      disabled={depositLoading || !customAmount || parseFloat(customAmount) < 5}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {depositLoading ? '...' : 'Оплатить'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">Минимум 5 €</p>
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-900 text-sm">История операций</h3>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-10">
                      <CreditCard className="w-10 h-10 mb-3 opacity-20" />
                      <p className="text-sm">История пуста</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <tbody className="divide-y divide-gray-100">
                        {transactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">
                              {tx.description}
                            </td>
                            <td className="px-6 py-4 text-gray-500">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </td>
                            <td className={`px-6 py-4 text-right font-bold ${
                              tx.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {tx.type === 'deposit' ? '+' : '-'}{(Math.abs(tx.amount) / 100).toFixed(2)} €
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // SERVICES TAB
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left: Config */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">1. Вакансия</h3>
                <div className="relative">
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-3 pr-8 cursor-pointer"
                  >
                    <option value="" disabled>-- Выберите вакансию --</option>
                    {jobs.map(job => (
                      <option key={job.id} value={job.id}>
                        {job.title} — {job.location} {job.isHighlighted ? '(HL)' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">2. Тип услуги</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setServiceType('highlight')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      serviceType === 'highlight' ? 'border-yellow-500 bg-yellow-50 ring-1 ring-yellow-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Star className={`w-6 h-6 mb-2 ${serviceType === 'highlight' ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <div className="font-bold text-gray-900">Highlight</div>
                    <div className="text-xs text-gray-500 mt-1">1 € / день</div>
                  </button>

                  <button
                    onClick={() => setServiceType('top')}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      serviceType === 'top' ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Zap className={`w-6 h-6 mb-2 ${serviceType === 'top' ? 'text-purple-600' : 'text-gray-400'}`} />
                    <div className="font-bold text-gray-900">TOP</div>
                    <div className="text-xs text-gray-500 mt-1">3 € / день</div>
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">3. Срок (дней)</h3>
                <div className="flex items-center gap-4">
                  {[3, 7, 14, 30].map(days => (
                    <button
                      key={days}
                      onClick={() => setDuration(days)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                        duration === days 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {days}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-lg sticky top-8">
                <h3 className="font-bold text-xl text-gray-900 mb-6">Итого</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Услуга</span>
                    <span className="font-medium">{serviceType === 'top' ? 'ТОП в поиске' : 'Выделение цветом'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Срок</span>
                    <span className="font-medium">{duration} дней</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Цена за день</span>
                    <span className="font-medium">{(PRICES[serviceType] / 100).toFixed(2)} €</span>
                  </div>
                  <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">К оплате</span>
                    <span className="font-bold text-2xl">{(totalPrice / 100).toFixed(2)} €</span>
                  </div>
                </div>

                <button 
                  onClick={handleBuyService}
                  disabled={isPromoting || !selectedJobId || balance < totalPrice}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                    balance >= totalPrice 
                      ? 'bg-black text-white hover:bg-gray-800 shadow-xl shadow-gray-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {balance >= totalPrice ? 'Оплатить с кошелька' : 'Недостаточно средств'}
                </button>
                
                {balance < totalPrice && (
                  <p className="text-center text-xs text-red-500 mt-3 font-medium">
                    Пополните баланс на вкладке "Кошелек"
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}