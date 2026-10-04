import { Bookmark, MapPin, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { imageUrl } from '../api.js';

export default function PostCard({ post, saved = false, onToggleSave, onDelete, own = false }) {
  return (
    <article className="post-card">
      <Link to={`/posts/${post._id}`} className={`post-image ${post.image ? '' : 'post-image-empty'}`}>
        {post.image ? <img src={imageUrl(post.image)} alt="" loading="lazy" /> : <span>{post.category?.slice(0, 1)}</span>}
        <span className="category-pill">{post.category}</span>
      </Link>
      <div className="post-card-body">
        <div className="post-card-meta"><span>{new Date(post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span><span className="meta-dot" /> <span className="post-location"><MapPin size={13} />{post.location}</span></div>
        <Link to={`/posts/${post._id}`} className="post-title"><h3>{post.title}</h3></Link>
        <p className="post-description">{post.description}</p>
        <div className="post-card-footer">
          <Link to={`/members/${post.owner?._id}`} className="post-owner">
            {post.owner?.profilePicture ? <img src={imageUrl(post.owner.profilePicture)} alt="" /> : <span className="mini-avatar">{post.owner?.name?.[0]?.toUpperCase() || '?'}</span>}
            <span>{post.owner?.name || 'Community member'}</span>
          </Link>
          <div className="card-actions">
            {own ? <>
              <Link to={`/posts/${post._id}/edit`} className="card-action" aria-label="Edit share"><Pencil size={16} /></Link>
              <button className="card-action card-action-danger" onClick={() => onDelete(post._id)} aria-label="Delete share"><Trash2 size={16} /></button>
            </> : <>
              <Link to={`/posts/${post._id}`} className="card-action" aria-label="View and contact"><MessageCircle size={16} /></Link>
              <button className={`card-action ${saved ? 'saved-action' : ''}`} onClick={() => onToggleSave(post._id)} aria-label={saved ? 'Remove saved share' : 'Save share'}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /></button>
            </>}
          </div>
        </div>
      </div>
    </article>
  );
}
