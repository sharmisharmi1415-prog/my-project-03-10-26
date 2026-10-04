import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, MapPin, Phone, UserRound } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage, imageUrl } from '../api.js';
import PostCard from '../components/PostCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/users/${id}`).then(response => setData(response.data)).catch(error => {
      toast.error(errorMessage(error));
      navigate('/', { replace: true });
    }).finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading || !data) return <Loading full />;
  const { user, posts } = data;
  return <div className="public-profile-page"><Link to="/" className="back-link"><ArrowLeft size={16} /> Back to exploring</Link><section className="public-profile-card"><div className="public-profile-avatar">{user.profilePicture ? <img src={imageUrl(user.profilePicture)} alt={user.name} /> : <span>{user.name?.[0]?.toUpperCase()}</span>}</div><div className="public-profile-info"><span className="eyebrow">YOUR QUICKSHARE NEIGHBOR</span><h1>{user.name}</h1>{user.location && <p className="public-location"><MapPin size={16} />{user.location}</p>}{user.about && <p className="public-about">{user.about}</p>}<div className="public-contact">{user.email && <a href={`mailto:${user.email}`}><Mail size={15} />{user.email}</a>}{user.phone && <a href={`tel:${user.phone}`}><Phone size={15} />{user.phone}</a>}</div><small className="member-since"><UserRound size={14} /> Neighbor since {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</small></div></section>
    <section className="public-posts"><div className="section-heading"><div><span className="eyebrow">GOOD THINGS SHARED</span><h2>{user.name.split(' ')[0]}’s shares <span className="heading-count">{posts.length}</span></h2></div></div>{posts.length ? <div className="post-grid">{posts.map(post => <PostCard key={post._id} post={post} />)}</div> : <EmptyState title="No shares just yet" text="Check back later to see what this neighbor shares with the community." />}</section>
  </div>;
}
