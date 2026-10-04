import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, MapPin, Upload, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage, imageUrl } from '../api.js';

const categoryOptions = ['Books', 'Notes', 'Study materials', 'Electronics', 'Chargers', 'Clothes', 'Furniture', 'Tools', 'Food', 'Travel help', 'Accommodation', 'Jobs', 'Services', 'Events', 'Lost & Found', 'Borrow / Lend', 'Buy / Sell', 'Other'];
const blankPost = { title: '', description: '', category: 'Other', location: '', contact: '', image: '' };

export default function PostForm() {
  const { id } = useParams();
  const editing = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState(blankPost);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!editing) return;
    api.get(`/posts/${id}`).then(({ data }) => {
      const post = data.post;
      setForm({ title: post.title, description: post.description, category: post.category, location: post.location, contact: post.contact || '', image: post.image || '' });
    }).catch(error => {
      toast.error(errorMessage(error));
      navigate('/my-posts', { replace: true });
    });
  }, [id, editing, navigate]);

  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast.error('Choose a JPEG, PNG, GIF, or WebP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Images must be 5 MB or smaller.');
      return;
    }
    setUploading(true);
    const body = new FormData();
    body.append('image', file);
    try {
      const { data } = await api.post('/uploads', body);
      setForm(current => ({ ...current, image: data.url }));
      toast.success('Image uploaded');
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
      if (editing) await api.patch(`/posts/${id}`, form);
      else await api.post('/posts', form);
      toast.success(editing ? 'Your share was updated' : 'Your share is live!');
      navigate('/my-posts');
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return <div className="form-page"><Link to="/my-posts" className="back-link"><ArrowLeft size={16} /> Back to my shares</Link><div className="form-page-heading"><span className="eyebrow">{editing ? 'MAKE IT JUST RIGHT' : 'PASS THE GOOD THINGS ON'}</span><h1>{editing ? 'Edit your share' : 'Share something good'}</h1><p>Clear details help the right person find what they need.</p></div>
    <form className="share-form" onSubmit={submit}>
      <label className="field"><span>Give it a title <b>*</b></span><input className="text-input" placeholder="e.g. A sturdy ladder, free to borrow" minLength="3" maxLength="120" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} required /><small>Keep it clear and easy to spot.</small></label>
      <label className="field"><span>Description <b>*</b></span><textarea className="text-input" placeholder="What should your neighbors know? Add details, condition, availability, or any helpful context." minLength="10" maxLength="3000" rows="5" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} required /><small>{form.description.length}/3000 characters</small></label>
      <div className="form-row"><label className="field"><span>Category <b>*</b></span><select className="text-input" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{categoryOptions.map(category => <option key={category}>{category}</option>)}</select></label><label className="field"><span><MapPin size={15} /> Location <b>*</b></span><input className="text-input" placeholder="Neighborhood or city" maxLength="120" value={form.location} onChange={event => setForm({ ...form, location: event.target.value })} required /></label></div>
      <label className="field"><span>How should people reach you?</span><input className="text-input" placeholder="Email, phone, or preferred contact method" maxLength="120" value={form.contact} onChange={event => setForm({ ...form, contact: event.target.value })} /><small>If blank, your profile contact details will be shown.</small></label>
      <div className="field"><span>Add a photo <small className="optional-label">optional</small></span><div className={`upload-area ${form.image ? 'has-image' : ''}`}>
        {form.image ? <><img src={imageUrl(form.image)} alt="Share preview" /><button type="button" className="remove-image" onClick={() => setForm({ ...form, image: '' })} aria-label="Remove image"><X size={16} /></button></> : <><span className="upload-icon"><ImagePlus size={24} /></span><strong>{uploading ? 'Uploading your photo…' : 'A picture tells the story'}</strong><small>JPG, PNG, GIF, or WebP · up to 5 MB</small><label className="button button-outline upload-button"><Upload size={15} /> Choose photo<input type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={upload} disabled={uploading} hidden /></label></>}
      </div></div>
      <div className="form-actions"><Link to="/my-posts" className="button button-quiet">Cancel</Link><button type="submit" className="button button-primary" disabled={busy || uploading}>{busy ? 'Saving…' : editing ? 'Save changes' : 'Publish share'}</button></div>
    </form>
  </div>;
}
