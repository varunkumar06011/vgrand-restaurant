import React, { useState } from 'react';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';
import { X, IndianRupee, Save } from 'lucide-react';

interface RecordCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RecordCashModal: React.FC<RecordCashModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('payments').insert({
        amount: Number(amount),
        payment_method: 'Cash',
        payment_status: 'success',
        order_id: null, // Manual entry
        // We could add a notes field if we update the schema, 
        // but for now we just record the transaction.
      });

      if (error) throw error;

      toast.success('Cash revenue recorded successfully!');
      onSuccess();
      onClose();
      setAmount('');
      setNote('');
    } catch (error: any) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-[#1A1A1A] border border-white/10 w-full max-w-md rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[80px]" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
              <IndianRupee size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold uppercase italic">Record Cash</h2>
              <p className="text-white/40 text-[10px] font-bold tracking-widest uppercase">Manual Revenue Entry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Amount (INR)</label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-emerald-500 transition-colors font-bold">₹</span>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium"
                autoFocus
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">Note / Reference</label>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. COD Delivery for Order #123" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all font-medium min-h-[100px] resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(16,185,129,0.2)]"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <>
                <Save size={20} />
                SAVE REVENUE
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecordCashModal;
