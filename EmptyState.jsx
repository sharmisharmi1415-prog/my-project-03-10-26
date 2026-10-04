import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ title = 'Nothing here just yet', text = 'Check back soon, or be the first to share something with your community.', action = false }) {
  return <div className="empty-state"><span className="empty-icon"><Compass size={24} /></span><h3>{title}</h3><p>{text}</p>{action && <Link to="/posts/new" className="button button-primary">Share something</Link>}</div>;
}
