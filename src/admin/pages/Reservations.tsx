import React, { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { 
  Calendar, 
  Users, 
  Phone, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Search,
  Utensils
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Reservation {
  id: string;
  customer_name: string;
  customer_phone: string;
  num_people: number;
  booking_time: string;
  items: any[];
  status: 'pending_payment' | 'pending_approval' | 'confirmed' | 'rejected';
  amount: number;
  token_number: number;
  created_at: string;
}

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('table_reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReservations(data || []);
    } catch (error: any) {
      toast.error('Failed to load reservations');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    
    // Realtime subscription
    const channel = supabase
      .channel('admin_reservations')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'table_reservations' }, () => {
        fetchReservations();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStatusUpdate = async (id: string, status: 'confirmed' | 'rejected') => {
    // Optimistic Update
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r));

    try {
      const { error } = await supabase
        .from('table_reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Reservation ${status} successfully`);
      // No need for fetchReservations here as optimistic update handled it
      // and the Realtime channel will catch it too if we want.
    } catch (error: any) {
      toast.error('Failed to update status');
      fetchReservations(); // Revert on error
    }
  };

  const filteredReservations = reservations.filter(res => {
    const matchesFilter = filter === 'all' || res.status === filter;
    const matchesSearch = res.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
                         res.customer_phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'pending_approval': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      default: return 'text-white/40 bg-white/5 border-white/10';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">
            Table <span className="text-[#D4AF37]">Reservations</span>
          </h2>
          <p className="text-white/40 text-sm mt-1">Manage AI-driven table bookings and pre-orders</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#D4AF37] transition-colors" size={18} />
            <input 
              type="text"
              placeholder="Search guest or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-[#1A1A1A] border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 w-64 transition-all"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#D4AF37]/50 transition-all text-white"
          >
            <option value="all">All Status</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-white/20 gap-4">
          <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
          <p className="text-sm font-medium tracking-widest uppercase">Fetching royal requests...</p>
        </div>
      ) : filteredReservations.length === 0 ? (
        <div className="h-64 border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center justify-center text-white/20">
          <Calendar size={48} className="mb-4 opacity-20" />
          <p>No reservations found matching your criteria</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReservations.map((res) => (
            <div 
              key={res.id}
              className="bg-white/5 border border-white/10 rounded-[32px] p-8 hover:bg-white/[0.07] transition-all group relative overflow-hidden"
            >
              {/* Status Badge */}
              <div className={cn(
                "absolute top-8 right-8 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                getStatusColor(res.status)
              )}>
                {res.status.replace('_', ' ')}
              </div>

              <div className="flex flex-col md:flex-row md:items-start gap-8">
                {/* Guest Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#D4AF37] border border-white/10">
                      <Users size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        {res.customer_name || 'Guest'}
                        <span className="text-[#D4AF37] text-xs font-black px-2 py-1 bg-[#D4AF37]/10 rounded-lg border border-[#D4AF37]/20 uppercase">
                          Order No: {res.token_number || '2800'}
                        </span>
                      </h3>
                      <div className="flex items-center gap-4 text-white/40 text-sm mt-1">
                        <span className="flex items-center gap-1.5"><Phone size={14} /> {res.customer_phone}</span>
                        <span className="flex items-center gap-1.5"><Clock size={14} /> {format(new Date(res.booking_time), 'hh:mm a')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Guests</p>
                      <p className="text-lg font-bold">{res.num_people}</p>
                    </div>
                    <div className="bg-black/20 rounded-2xl p-4 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest mb-1">Total Token</p>
                      <p className="text-lg font-bold text-[#D4AF37]">₹{res.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Pre-orders */}
                <div className="flex-1 space-y-3">
                   <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                     <Utensils size={12} /> Pre-ordered Items
                   </h4>
                   <div className="bg-black/40 rounded-2xl p-4 border border-white/5 min-h-[100px]">
                     {res.items && res.items.length > 0 ? (
                       <ul className="space-y-2">
                         {res.items.map((item, i) => {
                           const isString = typeof item === 'string';
                           return (
                             <li key={i} className="text-sm text-white/70 flex items-center gap-2 capitalize">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                               {isString ? item : `${item.quantity || 1}x ${item.name || 'Unknown Item'}`}
                             </li>
                           );
                         })}
                       </ul>
                     ) : (
                       <p className="text-white/20 text-xs italic">No pre-orders with this booking</p>
                     )}
                   </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 md:w-48">
                  {res.status === 'pending_approval' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(res.id, 'confirmed')}
                        className="w-full bg-[#D4AF37] text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#D4AF37]/90 transition-all uppercase italic text-xs tracking-widest active:scale-95"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button 
                         onClick={() => handleStatusUpdate(res.id, 'rejected')}
                         className="w-full bg-white/5 text-red-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all uppercase italic text-xs tracking-widest active:scale-95 border border-red-500/20"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </>
                  )}
                  <div className="flex items-center justify-between text-[10px] text-white/20 font-black uppercase mt-2 px-2">
                    <span>Requested:</span>
                    <span>{format(new Date(res.created_at), 'MMM dd')}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
