import { useState } from 'react';
import { ArrowRight, HeartHandshake, LockKeyhole, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const { acceptSession } = useAuth();
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post('/auth/login', form);
      acceptSession(data);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      navigate('/', { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return <div className="auth-page">
    <div className="auth-visual"><Link to="/" className="brand brand-light"><span className="brand-mark">q</span><span>quick<span>share</span></span></Link><div className="auth-message"><span className="eyebrow eyebrow-light">A little help goes a long way</span><h1>Good things<br />are better <em>shared.</em></h1><p>Your neighborhood is full of people ready to lend a hand. Find your people on QuickShare.</p><div className="auth-proof"><HeartHandshake size={18} /><span>Made for neighbors, powered by kindness.</span></div></div><div className="auth-decoration"><span>“</span><p>We rise by lifting others.</p><small>— Robert Ingersoll</small></div></div>
    <div className="auth-form-side"><div className="auth-form-wrap"><div className="auth-mobile-brand"><Link to="/" className="brand"><span className="brand-mark">q</span><span>quick<span>share</span></span></Link></div><span className="eyebrow">WELCOME BACK</span><h2>Log in to your account</h2><p className="auth-subtitle">Your community has been saving you a seat.</p>
      <form onSubmit={submit} className="form-stack">
        <label className="field"><span>Email address</span><div className="input-with-icon"><Mail size={18} /><input type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required /></div></label>
        <label className="field"><span>Password</span><div className="input-with-icon"><LockKeyhole size={18} /><input type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required /></div></label>
        <button className="button button-primary button-wide auth-submit" disabled={busy}>{busy ? 'Logging in…' : <>Log in <ArrowRight size={17} /></>}</button>
      </form><p className="auth-switch">New to QuickShare? <Link to="/signup">Create an account</Link></p><p className="auth-privacy">Your account is yours. We never share your personal details without your say-so.</p>
    </div></div>
  </div>;
}
