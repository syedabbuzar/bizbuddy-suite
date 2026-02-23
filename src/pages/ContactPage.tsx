import { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const contacts = [
  { name: 'IMRAN KHAN', phone: '8390090038', role: 'Owner' },
  { name: 'SADIQ KHAN', phone: '9359458298', role: 'Owner' },
  { name: 'DILSHAD KHAN', phone: '9356720070', role: 'Manager' },
];

export default function ContactPage() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    toast({ title: 'Message Sent!', description: 'We will get back to you soon.' });
    setForm({ name: '', phone: '', message: '' });
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="page-header">Contact Us</h1>
        <p className="text-muted-foreground mt-1">Get in touch with Sadik Traders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Cards */}
        <div className="space-y-4">
          <h2 className="font-display text-lg font-semibold flex items-center gap-2">
            <Phone size={18} className="text-primary" /> Shop Owners
          </h2>
          {contacts.map((c, i) => (
            <div
              key={c.phone}
              className="glass-card p-5 hover-lift animate-slide-up flex items-center gap-4"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                {c.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold">{c.name}</h3>
                <p className="text-xs text-muted-foreground">{c.role}</p>
              </div>
              <a
                href={`tel:+91${c.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover-glow transition-all hover:scale-105"
              >
                <Phone size={14} /> {c.phone}
              </a>
            </div>
          ))}

          <div className="glass-card p-5 animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-primary shrink-0" />
              <div>
                <h3 className="font-display font-semibold text-sm">Address</h3>
                <p className="text-sm text-muted-foreground">Sadik Traders, Wholesale & Retail — Dry Fruits & Spices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="font-display text-lg font-semibold flex items-center gap-2 mb-5">
            <MessageSquare size={18} className="text-primary" /> Send a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Your Name *</Label>
              <Input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Enter your name"
                required
                className="input-focus"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="Enter your phone number"
                className="input-focus"
              />
            </div>
            <div className="space-y-2">
              <Label>Message *</Label>
              <textarea
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message here..."
                required
                rows={4}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 input-focus resize-none"
              />
            </div>
            <Button type="submit" className="w-full gradient-primary text-primary-foreground hover-glow gap-2">
              <Send size={16} /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
