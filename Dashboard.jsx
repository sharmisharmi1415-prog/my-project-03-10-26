import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Bookmark, BriefcaseBusiness, ChevronRight, Coffee, Hammer, Heart, Home as HomeIcon, Laptop, MapPin, Search, Shirt, Sofa, Sparkles, Utensils, UserRound, Wrench } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, errorMessage } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import PostCard from '../components/PostCard.jsx';
import Loading from '../components/Loading.jsx';
import EmptyState from '../components/EmptyState.jsx';

const categories = [
  { name: 'Books', icon: BookOpen, color: 'peach' },
  { name: 'Study materials', icon: Sparkles, color: 'lilac' },
  { name: 'Electronics', icon: Laptop, color: 'blue' },
  { name: 'Clothes', icon: Shirt, color: 'pink' },
  { name: 'Furniture', icon: Sofa, color: 'sand' },
  { name: 'Tools', icon: Wrench, color: 'mint' },
  { name: 'Food', icon: Utensils, color: 'peach' },
  { name: 'Services', icon: BriefcaseBusiness, color: 'lilac' },
  { name: 'Accommodation', icon: HomeIcon, color: 'blue' },
  { name: 'Jobs', icon: Hammer, color: 'sand' },
  { name: 'Travel help', icon: MapPin, color: 'mint' },
  { name: 'Other', icon: Coffee, color: 'pink' }
];

export default function Dashboard() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get('q') || '');
  const [activeCategory, setActiveCategory] = useState(params.get('category') || 'All');
  const [posts, setPosts] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [saved, setSaved] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const [postResponse, savedResponse, recommendedResponse] = await Promise.all([
          api.get('/posts', { params: { q: query.trim() || undefined, category: activeCategory, limit: 60 } }),
          api.get('/bookmarks'),
          api.get('/posts', { params: { location: user?.location || undefined, limit: 4 } })
        ]);
        setPosts(postResponse.data.posts);
        setRecommended(recommendedResponse.data.posts.filter(post => post.owner?._id !== user?._id));
        setSaved(new Set(savedResponse.data.posts.map(post => post._id)));
      } catch (requestError) {
        setError(errorMessage(requestError));
      } finally {
        setLoading(false);
      }
    }, query ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [query, activeCategory, user?._id, user?.location]);

  useEffect(() => {
    const next = {};
    if (query.trim()) next.q = query.trim();
    if (activeCategory !== 'All') next.category = activeCategory;
    setParams(next, { replace: true });
  }, [query, activeCategory, setParams]);

  const suggestedCategory = useMemo(() => categories.slice(0, 4), []);

  async function toggleSave(id) {
    try {
      if (saved.has(id)) {
        await api.delete(`/bookmarks/${id}`);
        setSaved(current => { const next = new Set(current); next.delete(id); return next; });
        toast.success('Removed from your saved shares');
      } else {
        await api.post(`/bookmarks/${id}`);
        setSaved(current => new Set(current).add(id));
        toast.success('Saved for later');
      }
    } catch (requestError) {
      toast.error(errorMessage(requestError));
    }
  }

  const latestPosts = posts.slice(0, 8);

  return <div className="dashboard">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><span className="live-dot" /> YOUR COMMUNITY, A LITTLE CLOSER</span><h1>What do you<br />need <em>today?</em></h1><p>Find what you're looking for. Share what you have. It's amazing what neighbors can do together.</p>
        <form className="hero-search" onSubmit={event => event.preventDefault()}><Search size={21} /><input aria-label="Search shares" placeholder="Try “a ladder”, “biology notes”, “dog walker”…" value={query} onChange={event => setQuery(event.target.value)} /><kbd>⌘ K</kbd></form>
        <div className="search-suggestions"><span>Try:</span>{suggestedCategory.map(category => <button key={category.name} onClick={() => { setActiveCategory('All'); setQuery(category.name); }}>{category.name}</button>)}</div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-sun" /><div className="art-person person-one"><span /></div><div className="art-person person-two"><span /></div><div className="art-item item-book"><BookOpen size={27} /></div><div className="art-item item-heart"><Heart size={22} fill="currentColor" /></div><div className="art-item item-home"><HomeIcon size={22} /></div><span className="art-spark spark-one">✳</span><span className="art-spark spark-two">✦</span><div className="art-caption">little things,<br />big <em>kindness.</em></div></div>
      <div className="hero-bottom"><div className="community-avatars" aria-hidden="true"><span><Heart size={10} /></span><span><BookOpen size={10} /></span><span><Coffee size={10} /></span><span>+</span></div><span>Neighbors helping neighbors, every day.</span><Link to="/posts/new">Be part of it <ArrowRight size={15} /></Link></div>
    </section>

    <section className="category-section"><div className="section-heading"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Browse by category</h2></div><button className="text-link" onClick={() => { setActiveCategory('All'); setQuery(''); }}>See everything <ArrowRight size={16} /></button></div>
      <div className="category-grid">{categories.map(({ name, icon: Icon, color }) => <button key={name} className={`category-card category-${color} ${activeCategory === name ? 'category-active' : ''}`} onClick={() => { setQuery(''); setActiveCategory(activeCategory === name ? 'All' : name); }}><span className="category-icon"><Icon size={21} /></span><span>{name}</span><ChevronRight size={15} className="category-arrow" /></button>)}</div>
    </section>

    <section className="shares-section"><div className="section-heading"><div><span className="eyebrow">{activeCategory !== 'All' ? 'YOUR COMMUNITY HAS' : 'FRESH FROM YOUR COMMUNITY'}</span><h2>{query ? `Results for “${query}”` : activeCategory !== 'All' ? activeCategory : 'Recent shares'} <span className="heading-count">{posts.length}</span></h2></div><label className="category-select-wrap"><span className="sr-only">Filter by category</span><select value={activeCategory} onChange={event => setActiveCategory(event.target.value)}><option value="All">All categories</option>{categories.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}{['Notes', 'Chargers', 'Travel help', 'Events', 'Lost & Found', 'Borrow / Lend', 'Buy / Sell'].filter(item => !categories.some(category => category.name === item)).map(item => <option key={item} value={item}>{item}</option>)}</select></label></div>
      {error ? <div className="inline-error">{error} <button onClick={() => setQuery(current => `${current} `)}>Try again</button></div> : loading ? <Loading /> : posts.length ? <div className="post-grid">{latestPosts.map(post => <PostCard key={post._id} post={post} saved={saved.has(post._id)} onToggleSave={toggleSave} />)}</div> : <EmptyState title={query || activeCategory !== 'All' ? 'No shares found' : 'Be the first to share'} text={query || activeCategory !== 'All' ? 'Try another search or category. A good find might be just around the corner.' : 'Your community is just getting started. Add the first helpful thing for your neighbors.'} action />}
    </section>

    <section className="shares-section recommended-section"><div className="section-heading"><div><span className="eyebrow">{user?.location ? `A LITTLE CLOSER TO ${user.location.toUpperCase()}` : 'FRESH IDEAS FROM THE COMMUNITY'}</span><h2>Recommended for you</h2></div><Link to="/profile" className="text-link">Personalize your profile <ArrowRight size={16} /></Link></div>
      {loading ? <Loading /> : recommended.length ? <div className="post-grid">{recommended.map(post => <PostCard key={post._id} post={post} saved={saved.has(post._id)} onToggleSave={toggleSave} />)}</div> : <EmptyState title={user?.location ? 'No nearby shares yet' : 'Good things are coming'} text={user?.location ? 'Try adding a nearby city or neighborhood to your profile, or check back soon.' : 'Add your location to your profile and we’ll surface shares closer to home.'} />}
    </section>

    <section className="quick-actions"><div className="quick-actions-heading"><span className="eyebrow">YOUR QUICKSHARE SHORTCUTS</span><h2>A little something for every day.</h2></div><div className="quick-action-grid">
      <Link to="/posts/new" className="quick-action-card"><span className="quick-action-icon action-share"><Heart size={19} /></span><span><strong>Share something</strong><small>Pass a good thing along</small></span><ArrowUpRight size={16} /></Link>
      <Link to="/saved" className="quick-action-card"><span className="quick-action-icon action-saved"><Bookmark size={19} /></span><span><strong>Find your saved shares</strong><small>Pick up where you left off</small></span><ArrowUpRight size={16} /></Link>
      <Link to="/profile" className="quick-action-card"><span className="quick-action-icon action-profile"><UserRound size={19} /></span><span><strong>Update your profile</strong><small>Help neighbors find you</small></span><ArrowUpRight size={16} /></Link>
    </div></section>

    <section className="share-cta"><div className="cta-icon"><Heart size={24} /></div><div><span className="eyebrow">HAVE SOMETHING TO OFFER?</span><h2>Your next small kindness starts here.</h2><p>That book on your shelf could be someone's next big idea.</p></div><Link to="/posts/new" className="button button-dark">Share something <ArrowUpRight size={17} /></Link></section>
    <div className="sr-only">Welcome, {user?.name}. Nearby and latest community posts are shown above.</div>
  </div>;
}
