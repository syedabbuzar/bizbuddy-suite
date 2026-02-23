import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, Phone } from 'lucide-react';

export default function SettingsPage() {
  const { shopInfo, updateShopInfo } = useStore();
  const { toast } = useToast();
  const [form, setForm] = useState(shopInfo);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateShopInfo(form);
    toast({ title: 'Settings Saved!' });
  };

  const contacts = [
    { name: 'IMRAN KHAN', phone: '8390090038' },
    { name: 'SADIQ KHAN', phone: '9359458298' },
    { name: 'DILSHAD KHAN', phone: '9356720070' },
  ];

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="page-header">Settings</h1>

      <form onSubmit={handleSave} className="glass-card p-6 space-y-5 animate-slide-up">
        <h3 className="font-display font-semibold text-lg">Shop Information</h3>
        <p className="text-sm text-muted-foreground">This info appears on your bills.</p>

        <div className="space-y-2">
          <Label>Shop Name</Label>
          <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-focus" />
        </div>
        <div className="space-y-2">
          <Label>Contact Number</Label>
          <Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="input-focus" />
        </div>
        <div className="space-y-2">
          <Label>Address</Label>
          <Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="input-focus" />
        </div>
        <div className="space-y-2">
          <Label>Bill Tagline</Label>
          <Input value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })} className="input-focus" />
        </div>

        <Button type="submit" className="gradient-primary text-primary-foreground gap-2 hover-glow">
          <Save size={16} /> Save Settings
        </Button>
      </form>

      <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h3 className="font-display font-semibold text-lg mb-4">Contact Information</h3>
        <div className="space-y-3">
          {contacts.map((c, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
              <span className="font-medium text-sm">{c.name}</span>
              <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline font-medium">
                <Phone size={14} /> {c.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
