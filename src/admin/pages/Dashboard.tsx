import React, { useEffect, useState } from 'react';
import { supabase } from '@/db/supabase';
import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  ArrowUpRight,
  TrendingDown,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import TimeRangeSwitcher from '../components/TimeRangeSwitcher';

type TimeRange = 'today' | 'week' | 'month';

interface Stats {
  orderCount: number;
  totalRevenue: number;
  activeProducts: number;
}

const Dashboard: React.FC = () => {
  const [activeRange, setActiveRange] = useState<TimeRange>('today');
  const [stats, setStats] = useState<Stats>({
    orderCount: 0,
    totalRevenue: 0,
    activeProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const now = new Date();
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);

      if (activeRange === 'week') {
        startDate.setDate(now.getDate() - 7);
      } else if (activeRange === 'month') {
        startDate.setDate(1); // Start of month
      }

      try {
        setLoading(true);
        // Orders in Range
        const { count: orderCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', startDate.toISOString());

        // Revenue in Range
        const { data: revRange } = await supabase
          .from('orders')
          .select('total_amount')
          .gte('created_at', startDate.toISOString())
          .neq('status', 'cancelled');
        
        const totalRevenue = revRange?.reduce((acc, curr) => acc + Number(curr.total_amount), 0) || 0;

        // Active Products
        const { count: activeProd } = await supabase
          .from('menu_items')
          .select('*', { count: 'exact', head: true })
          .eq('is_available', true);

        // Recent Orders
        const { data: recent } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          orderCount: orderCount || 0,
          totalRevenue,
          activeProducts: activeProd || 0,
        });
        setRecentOrders(recent || []);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [activeRange]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { label: `Orders ${activeRange}`, value: stats.orderCount, icon: ShoppingBag, color: 'text-blue-500' },
    { label: `Revenue ${activeRange}`, value: `₹${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-emerald-500' },
    { label: 'Active Products', value: stats.activeProducts, icon: Users, color: 'text-[#D4AF37]' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase italic">Dashboard Overview</h1>
          <p className="text-white/40 mt-1">Real-time metrics for V Grand Restaurant</p>
        </div>
        <TimeRangeSwitcher activeRange={activeRange} onRangeChange={setActiveRange} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-[#1A1A1A] border border-white/5 p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] uppercase font-bold text-white/20 tracking-wider">Live</span>
            </div>
            <p className="text-sm font-medium text-white/60">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-[#D4AF37] hover:underline uppercase tracking-wider font-bold">View All</Link>
          </div>
          <div className="space-y-4">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-white/40 italic">No recent orders found.</p>
            ) : recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.customer_name}</p>
                    <p className="text-[10px] text-white/40">{new Date(order.created_at).toLocaleTimeString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">₹{order.total_amount}</p>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 
                    order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Performance Summary</h2>
            <TrendingUp size={20} className="text-[#D4AF37]" />
          </div>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/60 text-xs">Total Target Progress</span>
                <span className="font-bold">78%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#D4AF37] w-[78%]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Customer Satisfaction</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">4.9</span>
                  <ArrowUpRight size={14} className="text-emerald-500" />
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                <p className="text-[10px] text-white/40 uppercase font-bold mb-1">Return Rate</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">2.4%</span>
                  <TrendingDown size={14} className="text-red-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;
