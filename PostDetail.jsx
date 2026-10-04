import { useEffect, useState } from 'react';
import { ArrowLeft, Bookmark, CalendarDays, Mail, MapPin, MessageCircle, Phone, Share2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage, imageUrl } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import Loading from '../components/Loading.jsx';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get(`/posts/${id}`), api.get('/bookmarks')])
      .then(([postResponse, bookmarkResponse]) => {
        setPost(postResponse.data.post);
        setSaved(bookmarkResponse.data.posts.some(item => item._id === id));
      })
      .catch(error => {
        toast.error(errorMessage(error));
        navigate('/', { replace: true });
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  async function toggleSaved() {
    try {
      if (saved) await api.delete(`/bookmarks/${id}`);
      else await api.post(`/bookmarks/${id}`);
      setSaved(!saved);
      toast.success(saved ? 'Removed from saved shares' : 'Saved for later');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  if (loading || !post) return <Loading full />;
  const owner = post.owner;
  const own = owner?._id === user?._id;
  const contact = post.contact || owner?.phone || owner?.email;

  return <div className="detail-page"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to exploring</Link><div className="detail-layout">
    <div className={`detail-image ${post.image ? '' : 'detail-image-empty'}`}>{post.image ? <img src={imageUrl(post.image)} alt={post.title} /> : <span>{post.category?.slice(0, 1)}</span>}</div>
    <article className="detail-main"><div className="detail-meta"><span className="category-pill">{post.category}</span><span><CalendarDays size={15} /> {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span></div><h1>{post.title}</h1><div className="detail-location"><MapPin size={17} /> {post.location}</div><div className="detail-description">{post.description.split('\n').map((line, index) => <p key={index}>{line}</p>)}</div>
      {own ? <div className="detail-actions"><Link className="button button-primary" to={`/posts/${id}/edit`}>Edit your share</Link></div> : <div className="detail-actions"><button className="button button-primary" onClick={() => { if (contact?.includes('@')) window.location.href = `mailto:${contact}`; else if (contact) window.location.href = `tel:${contact}`; else toast.error('This neighbor has not added contact details yet.'); }}><MessageCircle size={17} /> Contact {owner?.name?.split(' ')[0] || 'owner'}</button><button className={`button button-outline ${saved ? 'saved-button' : ''}`} onClick={toggleSaved}><Bookmark size={17} fill={saved ? 'currentColor' : 'none'} /> {saved ? 'Saved' : 'Save for later'}</button></div>}
      <div className="detail-owner-card"><div className="owner-card-heading"><span className="eyebrow">SHARED BY</span><Link to={`/members/${owner?._id}`} className="text-link">View profile <Share2 size={15} /></Link></div><Link to={`/members/${owner?._id}`} className="owner-profile-link">{owner?.profilePicture ? <img src={imageUrl(owner.profilePicture)} alt="" /> : <span className="avatar avatar-placeholder">{owner?.name?.[0]?.toUpperCase()}</span>}<span><strong>{owner?.name}</strong><small>{owner?.location || 'QuickShare community member'}</small></span></Link>{owner?.about && <p className="owner-about">{owner.about}</p>}{contact && <div className="contact-detail">{contact.includes('@') ? <Mail size={15} /> : <Phone size={15} />}{contact}</div>}{owner?.phone && post.contact && owner.phone !== post.contact && <div className="contact-detail"><Phone size={15} />{owner.phone}</div>}</div>
    </article>
  </div></div>;
}
