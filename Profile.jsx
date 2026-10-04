import { useEffect, useState } from 'react';
import { ArrowLeft, Camera, MapPin, Save, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage, imageUrl } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', location: '', profilePicture: '', about: '' });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '', location: user.location || '', profilePicture: user.profilePicture || '', about: user.about || '' });
  }, [user]);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Choose a JPEG, PNG, GIF, or WebP image up to 5 MB.');
      event.target.value = '';
      return;
    }
    const body = new FormData();
    body.append('image', file);
    setUploading(true);
    try {
      const { data } = await api.post('/uploads', body);
      setForm(current => ({ ...current, profilePicture: data.url }));
      toast.success('Profile photo uploaded');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  }

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.patch('/users/me', form);
      updateUser(data.user);
      toast.success('Your profile is up to date');
      navigate('/profile', { replace: true });
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return <div className="profile-page"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to exploring</Link><div className="page-title"><span className="eyebrow">A LITTLE MORE ABOUT YOU</span><h1><UserRound /> Your profile</h1><p>Help your neighbors get to know the person behind the share.</p></div>
    <form className="profile-form" onSubmit={submit}><div className="profile-form-top"><div className="profile-avatar-wrap">{form.profilePicture ? <img src={imageUrl(form.profilePicture)} alt="Your profile" /> : <span className="profile-avatar-placeholder">{form.name?.[0]?.toUpperCase()}</span>}<label className="camera-button" title="Change profile photo"><Camera size={16} /><input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={upload} disabled={uploading} hidden /></label></div><div><h2>{form.name || 'Your name'}</h2><p>{user?.email}</p><small>{uploading ? 'Uploading photo…' : 'Click the camera to add a profile photo'}</small></div></div>
      <div className="profile-fields"><label className="field"><span>Your name <b>*</b></span><input className="text-input" minLength="2" maxLength="80" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} required /></label><label className="field"><span>Email address</span><input className="text-input input-readonly" type="email" value={user?.email || ''} readOnly /><small>Email address can’t be changed.</small></label><label className="field"><span>Phone number</span><input className="text-input" type="tel" maxLength="30" placeholder="Add a phone number" value={form.phone} onChange={event => setForm({ ...form, phone: event.target.value })} /></label><label className="field"><span><MapPin size={15} /> Location</span><input className="text-input" maxLength="120" placeholder="Your neighborhood or city" value={form.location} onChange={event => setForm({ ...form, location: event.target.value })} /></label><label className="field profile-about"><span>About you</span><textarea className="text-input" rows="4" maxLength="500" placeholder="Share a little about yourself, your interests, or how you like to help." value={form.about} onChange={event => setForm({ ...form, about: event.target.value })} /><small>{form.about.length}/500 characters</small></label></div>
      <div className="profile-actions"><Link to="/my-posts" className="button button-quiet">My shares</Link><button className="button button-primary" disabled={busy || uploading}>{busy ? 'Saving…' : <><Save size={16} /> Save profile</>}</button></div>
    </form>
  </div>;
}
