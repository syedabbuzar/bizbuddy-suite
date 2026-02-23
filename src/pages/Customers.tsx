import { useStore } from '@/context/StoreContext';
import { useAuth } from '@/context/AuthContext';
import { Search, Trash2, Pencil, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CustomerRow {
  key: string;
  name: string;
  type: string;
  totalPurchases: number;
  billCount: number;
}

export default function Customers() {
  const { bills, deleteCustomerBills, updateCustomerInBills } = useStore();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ step: number; customer: CustomerRow | null }>({ step: 0, customer: null });
  const [editCustomer, setEditCustomer] = useState<CustomerRow | null>(null);
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('normal');

  const allCustomers = useMemo(() => {
    const customerMap = new Map<string, CustomerRow>();

    bills.forEach(b => {
      const key = b.customerName.toLowerCase().trim();
      const existing = customerMap.get(key);
      if (existing) {
        existing.totalPurchases += b.total;
        existing.billCount += 1;
      } else {
        customerMap.set(key, {
          key,
          name: b.customerName,
          type: b.customerType,
          totalPurchases: b.total,
          billCount: 1,
        });
      }
    });

    return Array.from(customerMap.values());
  }, [bills]);

  const filtered = allCustomers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const grandTotal = filtered.reduce((sum, c) => sum + c.totalPurchases, 0);
  const totalBills = filtered.reduce((sum, c) => sum + c.billCount, 0);

  const handleDeleteClick = (customer: CustomerRow) => {
    setDeleteConfirm({ step: 1, customer });
  };

  const handleDeleteConfirmStep = () => {
    if (deleteConfirm.step === 1) {
      setDeleteConfirm({ ...deleteConfirm, step: 2 });
    } else if (deleteConfirm.step === 2 && deleteConfirm.customer) {
      deleteCustomerBills(deleteConfirm.customer.name);
      toast({ title: 'Customer deleted', description: `${deleteConfirm.customer.name} and all their bills removed.` });
      setDeleteConfirm({ step: 0, customer: null });
    }
  };

  const handleEditClick = (customer: CustomerRow) => {
    setEditCustomer(customer);
    setEditName(customer.name);
    setEditType(customer.type);
  };

  const handleEditSave = () => {
    if (!editCustomer || !editName.trim()) return;
    updateCustomerInBills(editCustomer.name, editName.trim(), editType as 'normal' | 'retailer');
    toast({ title: 'Customer updated', description: `Updated to ${editName.trim()}` });
    setEditCustomer(null);
  };

  const selectClass = "flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 input-focus";

  return (
    <div className="space-y-6">
      <h1 className="page-header">Customers</h1>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 input-focus" />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Bills</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                {isAdmin && <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.key} className="table-row-hover border-b border-border/50 animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="py-3 px-4 font-medium flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    {c.name}
                  </td>
                  <td className="py-3 px-4">
                    <span className={c.type === 'retailer' ? 'badge-success' : 'badge-warning'}>{c.type}</span>
                  </td>
                  <td className="py-3 px-4 text-center">{c.billCount}</td>
                  <td className="py-3 px-4 text-right font-semibold">₹{c.totalPurchases.toLocaleString('en-IN')}</td>
                  {isAdmin && (
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center gap-1">
                        <button onClick={() => handleEditClick(c)} className="p-1.5 rounded hover:bg-primary/10 text-primary transition-colors" title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDeleteClick(c)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors" title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={isAdmin ? 5 : 4} className="text-center py-8 text-muted-foreground">No customers found. Generate bills from the Billing page.</td></tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="bg-muted/50 border-t-2 border-border font-semibold">
                  <td className="py-3 px-4" colSpan={2}>Total ({filtered.length} customers)</td>
                  <td className="py-3 px-4 text-center">{totalBills}</td>
                  <td className="py-3 px-4 text-right text-primary font-bold text-base">₹{grandTotal.toLocaleString('en-IN')}</td>
                  {isAdmin && <td></td>}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Delete Confirmation Dialog - 2 step */}
      <Dialog open={deleteConfirm.step > 0} onOpenChange={(open) => { if (!open) setDeleteConfirm({ step: 0, customer: null }); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">
              {deleteConfirm.step === 1 ? 'Delete Customer?' : 'Are you really sure?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {deleteConfirm.step === 1 && (
              <p className="text-sm text-muted-foreground">
                Are you sure you want to delete <strong>{deleteConfirm.customer?.name}</strong> and all their {deleteConfirm.customer?.billCount} bill(s)?
              </p>
            )}
            {deleteConfirm.step === 2 && (
              <p className="text-sm text-destructive font-medium">
                ⚠️ This action cannot be undone! All data for <strong>{deleteConfirm.customer?.name}</strong> will be permanently deleted.
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setDeleteConfirm({ step: 0, customer: null })}>
                <X size={14} className="mr-1" /> Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteConfirmStep}>
                <Check size={14} className="mr-1" /> {deleteConfirm.step === 1 ? 'Yes, Delete' : 'Final Confirm - Delete!'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editCustomer} onOpenChange={(open) => { if (!open) setEditCustomer(null); }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle className="font-display">Edit Customer</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} className="input-focus" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <select value={editType} onChange={e => setEditType(e.target.value)} className={selectClass}>
                <option value="normal">Normal</option>
                <option value="retailer">Retailer</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setEditCustomer(null)}>Cancel</Button>
              <Button onClick={handleEditSave} className="gradient-primary text-primary-foreground hover-glow">Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
