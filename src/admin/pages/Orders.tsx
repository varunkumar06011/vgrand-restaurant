import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { 
  Search, 
  MoreVertical, 
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import type { Order, OrderStatus } from '@/types/restaurant';

const statusColors: Record<OrderStatus, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
  refunded: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast.error(`Error fetching orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to new orders
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
      toast.success(`Order ${newStatus} successfully`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (error: any) {
      toast.error(`Update failed: ${error.message}`);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.customer_phone.includes(search)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-sm text-white/40">Manage and track customer orders</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchOrders()}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone or ID..." 
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-[10px] uppercase font-bold tracking-wider text-white/40">
                <th className="px-6 py-4">Order ID / Date</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
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
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-white/40 italic">
                    No orders found matching the criteria.
                  </td>
                </tr>
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white/80">#{order.id.slice(0, 8)}</span>
                    </div>
                    <p className="text-[10px] text-white/40">{new Date(order.created_at).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-xs text-white/40">{order.customer_phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2 overflow-hidden">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-[#1A1A1A] bg-[#D4AF37] text-black text-[10px] flex items-center justify-center font-bold">
                          {item.quantity}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#1A1A1A] bg-white/10 text-white text-[10px] flex items-center justify-center">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold">
                    ₹{order.total_amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border",
                      statusColors[order.status]
                    )}>
                      {order.status === 'completed' && <CheckCircle2 size={10} />}
                      {order.status === 'pending' && <Clock size={10} />}
                      {order.status === 'cancelled' && <XCircle size={10} />}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {order.status === 'pending' && (
                         <>
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'completed' as OrderStatus)}
                             className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all"
                             title="Mark as Completed"
                           >
                             <CheckCircle2 size={16} />
                           </button>
                           <button 
                             onClick={() => updateOrderStatus(order.id, 'cancelled' as OrderStatus)}
                             className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                             title="Cancel Order"
                           >
                             <XCircle size={16} />
                           </button>
                         </>
                       )}
                       <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
                         <MoreVertical size={16} />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
