import { useEffect, useState } from 'react';
import { Bookmark, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage } from '../api.js';
import PostCard from '../components/PostCard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Loading from '../components/Loading.jsx';

export default function Collection({ saved = false, mine = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(mine ? '/users/me/posts' : '/bookmarks');
      setPosts(data.posts);
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete this share? This cannot be undone.')) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts(items => items.filter(post => post._id !== id));
      toast.success('Your share was deleted');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }
  async function unsave(id) {
    try {
      await api.delete(`/bookmarks/${id}`);
      setPosts(items => items.filter(post => post._id !== id));
      toast.success('Removed from saved shares');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  }

  const title = mine ? 'My shares' : 'Saved for later';
  return <div className="collection-page"><div className="page-title"><span className="eyebrow">{mine ? 'YOUR CONTRIBUTIONS' : 'THE GOOD FINDS'}</span><h1>{mine ? <FileText /> : <Bookmark />} {title}</h1><p>{mine ? 'Everything you’ve put out into the community.' : 'All the helpful things you wanted to come back to.'}</p></div>
    {loading ? <Loading /> : posts.length ? <div className="post-grid">{posts.map(post => <PostCard key={post._id} post={post} saved={saved || !mine} own={mine} onToggleSave={unsave} onDelete={remove} />)}</div> : <EmptyState title={mine ? 'Your story starts here' : 'A spot for the good finds'} text={mine ? 'Have something useful to share? Your neighbors would love to hear about it.' : 'Save a share you like, and you’ll find it waiting here.'} action={mine} />}
  </div>;
}
