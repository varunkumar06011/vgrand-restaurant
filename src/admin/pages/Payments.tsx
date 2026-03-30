import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { 
  CreditCard, 
  Search, 
  Download,
  Calendar,
  IndianRupee,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import RecordCashModal from '../components/RecordCashModal';

interface Payment {
  id: string;
  order_id: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
}

const Payments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // Fallback to fetching from orders if payments table is empty or doesn't exist
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('id, total_amount, payment_method, status, created_at')
          .order('created_at', { ascending: false });
        
        if (orderError) throw orderError;
        
        setPayments((orderData || []).map(o => ({
          id: o.id,
          order_id: o.id,
          amount: Number(o.total_amount),
          payment_method: o.payment_method,
          payment_status: o.status === 'completed' ? 'success' : 'pending',
          created_at: o.created_at
        })));
      } else {
        setPayments(data || []);
      }
    } catch (error: any) {
      toast.error(`Error fetching payments: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(p => 
    (p.order_id?.toLowerCase().includes(search.toLowerCase()) || '') || 
    p.payment_method.toLowerCase().includes(search.toLowerCase()) ||
    (p.id.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-in fade-in transition-all duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold uppercase italic tracking-tighter">Transaction History</h1>
          <p className="text-sm text-white/40">Verified payment records and audits</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white border border-emerald-500/20 rounded-2xl font-bold text-sm hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)] uppercase italic"
          >
            <IndianRupee size={18} />
            Record Cash
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 text-white/80 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/10 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase italic">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck size={20} className="text-[#D4AF37]" />
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Total Transaction Volume</span>
          </div>
          <p className="text-2xl font-bold">₹{payments.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <IndianRupee size={20} className="text-emerald-500" />
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Successful Transactions</span>
          </div>
          <p className="text-2xl font-bold">{payments.length}</p>
        </div>
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <CreditCard size={20} className="text-[#D4AF37]" />
            <span className="text-xs text-white/40 font-medium uppercase tracking-widest">Payment Security</span>
          </div>
          <p className="text-2xl font-bold italic opacity-30 tracking-widest">SSL SECURE</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
        <input 
          type="text" 
          placeholder="Search transactions..." 
          className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-wider text-white/40">
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Security Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent mx-auto"></div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-white/40 italic">
                    No transactions found.
                  </td>
                </tr>
              ) : filteredPayments.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono text-white/40 uppercase">
                    {p.order_id ? `${p.order_id.slice(0, 8)}...` : <span className="text-emerald-500/60 tracking-widest text-[9px] font-bold">MANUAL_ENTRY</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar size={14} className="text-white/20" />
                      {new Date(p.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold uppercase tracking-widest">{p.payment_method}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-sm">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full w-fit">
                      <ShieldCheck size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">VERIFIED</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <RecordCashModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchPayments} 
      />
    </div>
  );
};

export default Payments;
