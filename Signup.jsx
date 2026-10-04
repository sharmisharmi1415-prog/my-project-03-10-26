import { useState } from 'react';
import { ArrowRight, HeartHandshake, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { acceptSession } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      acceptSession(data);
      toast.success('Your QuickShare account is ready!');
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page">
    <div className="auth-visual"><Link to="/" className="brand brand-light"><span className="brand-mark">q</span><span>quick<span>share</span></span></Link><div className="auth-message"><span className="eyebrow eyebrow-light">Your community starts here</span><h1>Small shares.<br /><em>Big difference.</em></h1><p>Borrow a book, find a helping hand, or pass something on. Good things start with saying hello.</p><div className="auth-proof"><HeartHandshake size={18} /><span>A more connected neighborhood, one share at a time.</span></div></div><div className="auth-decoration"><span>“</span><p>No one is useless in this world who lightens the burdens of another.</p><small>— Charles Dickens</small></div></div>
    <div className="auth-form-side"><div className="auth-form-wrap"><div className="auth-mobile-brand"><Link to="/" className="brand"><span className="brand-mark">q</span><span>quick<span>share</span></span></Link></div><span className="eyebrow">JOIN THE NEIGHBORHOOD</span><h2>Create your account</h2><p className="auth-subtitle">It takes a minute. Good things last longer.</p>
      <form onSubmit={submit} className="form-stack">
        <label className="field"><span>Your name</span><div className="input-with-icon"><UserRound size={18} /><input type="text" autoComplete="name" placeholder="How should we call you?" minLength="2" maxLength="80" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></div></label>
        <label className="field"><span>Email address</span><div className="input-with-icon"><Mail size={18} /><input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div></label>
        <label className="field"><span>Password</span><div className="input-with-icon"><LockKeyhole size={18} /><input type="password" autoComplete="new-password" placeholder="At least 8 characters" minLength="8" maxLength="72" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div></label>
        <button className="button button-primary button-wide auth-submit" disabled={busy}>{busy ? 'Creating account…' : <>Create account <ArrowRight size={17} /></>}</button>
      </form><p className="auth-switch">Already part of QuickShare? <Link to="/login">Log in</Link></p><p className="auth-privacy">By joining, you agree to be kind, respectful, and a good neighbor.</p>
    </div></div>
  </div>;
}
