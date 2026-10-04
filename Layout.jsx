import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, Bookmark, ChevronDown, Compass, LogOut, Menu, Plus, UserRound, X } from 'lucide-react';
import { useAuth } from '../AuthContext.jsx';
import { imageUrl } from '../api.js';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function signOut() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="QuickShare home"><span className="brand-mark">q</span><span>quick<span>share</span></span></Link>
        <button className="mobile-menu icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        <nav className={`main-nav ${menuOpen ? 'nav-open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}><Compass size={17} /> Explore</NavLink>
          <NavLink to="/saved" onClick={() => setMenuOpen(false)}><Bookmark size={17} /> Saved</NavLink>
          <NavLink to="/my-posts" onClick={() => setMenuOpen(false)}><Bell size={17} /> My shares</NavLink>
        </nav>
        <div className="header-actions">
          <Link className="button button-primary button-small" to="/posts/new"><Plus size={17} /> Share something</Link>
          <div className="user-menu">
            <Link to="/profile" className="avatar-link" aria-label="Your profile">
              {user?.profilePicture ? <img src={imageUrl(user.profilePicture)} alt="" className="avatar" /> : <span className="avatar avatar-placeholder">{user?.name?.[0]?.toUpperCase()}</span>}
              <span className="header-user-name">{user?.name?.split(' ')[0]}</span><ChevronDown size={15} />
            </Link>
            <button className="signout-button" onClick={signOut} title="Log out"><LogOut size={17} /><span>Log out</span></button>
          </div>
        </div>
      </header>
      <main className="page-content">{children}</main>
      <footer className="footer"><span>© {new Date().getFullYear()} QuickShare</span><span>Good things are better when shared.</span></footer>
    </div>
  );
}
