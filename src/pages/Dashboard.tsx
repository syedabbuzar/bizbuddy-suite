import { useStore } from '@/context/StoreContext';
import { Package, ShoppingCart, Users, AlertTriangle, TrendingUp, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { products, bills, customers } = useStore();

  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const lowStockCount = products.filter(p => p.stock <= 10).length;
  const totalRevenue = bills.reduce((s, b) => s + b.total, 0);
  const todayBills = bills.filter(b => b.date === new Date().toISOString().split('T')[0]);
  const todayRevenue = todayBills.reduce((s, b) => s + b.total, 0);

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-primary' },
    { label: 'Total Stock', value: totalStock + ' units', icon: TrendingUp, color: 'text-emerald-light' },
    { label: 'Low Stock Items', value: lowStockCount, icon: AlertTriangle, color: 'text-warning', link: '/low-stock' },
    { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-accent' },
    { label: "Today's Bills", value: todayBills.length, icon: ShoppingCart, color: 'text-primary' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: IndianRupee, color: 'text-success' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-header">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back to Sadik Traders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, i) => {
          const Card = (
            <div key={i} className="stat-card group" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold font-display mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl bg-muted ${stat.color} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                  <stat.icon size={22} />
                </div>
              </div>
            </div>
          );
          return stat.link ? <Link to={stat.link} key={i}>{Card}</Link> : <div key={i}>{Card}</div>;
        })}
      </div>

      {/* Today's Revenue */}
      <div className="glass-card p-6">
        <h3 className="font-display text-lg font-semibold mb-2">Today's Summary</h3>
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Revenue</p>
            <p className="text-xl font-bold text-primary">₹{todayRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bills Generated</p>
            <p className="text-xl font-bold">{todayBills.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      {bills.length > 0 && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="font-display text-lg font-semibold mb-4">Recent Bills</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 text-muted-foreground font-medium">Bill No</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Customer</th>
                  <th className="text-left py-2 text-muted-foreground font-medium">Date</th>
                  <th className="text-right py-2 text-muted-foreground font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {bills.slice(-5).reverse().map(bill => (
                  <tr key={bill.id} className="table-row-hover border-b border-border/50">
                    <td className="py-2.5 font-medium">{bill.billNo}</td>
                    <td className="py-2.5">{bill.customerName}</td>
                    <td className="py-2.5 text-muted-foreground">{bill.date}</td>
                    <td className="py-2.5 text-right font-semibold">₹{bill.total.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
