import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Layout from './components/Layout.jsx';
import Loading from './components/Loading.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Profile from './pages/Profile.jsx';
import PostForm from './pages/PostForm.jsx';
import PostDetail from './pages/PostDetail.jsx';
import PublicProfile from './pages/PublicProfile.jsx';
import Collection from './pages/Collection.jsx';

function SessionError() {
  const { authError, retryAuth, logout } = useAuth();
  return <main className="session-error">
    <div className="session-error-card">
      <span className="eyebrow">CONNECTION ISSUE</span>
      <h1>We couldn’t restore your session.</h1>
      <p>{authError}</p>
      <div className="session-error-actions">
        <button className="button button-primary" onClick={retryAuth}>Retry connection</button>
        <button className="button button-outline" onClick={logout}>Go to login</button>
      </div>
    </div>
  </main>;
}

function Protected({ children }) {
  const { user, loading, authError } = useAuth();
  if (loading) return <Loading full />;
  if (authError) return <SessionError />;
  return user ? children : <Navigate to="/login" replace />;
}

function Guest({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Loading full />;
  return user ? <Navigate to="/" replace /> : children;
}

function PrivateLayout({ children }) {
  return <Protected><Layout>{children}</Layout></Protected>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Guest><Login /></Guest>} />
      <Route path="/signup" element={<Guest><Signup /></Guest>} />
      <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
      <Route path="/profile" element={<PrivateLayout><Profile /></PrivateLayout>} />
      <Route path="/posts/new" element={<PrivateLayout><PostForm /></PrivateLayout>} />
      <Route path="/posts/:id/edit" element={<PrivateLayout><PostForm /></PrivateLayout>} />
      <Route path="/posts/:id" element={<PrivateLayout><PostDetail /></PrivateLayout>} />
      <Route path="/members/:id" element={<PrivateLayout><PublicProfile /></PrivateLayout>} />
      <Route path="/saved" element={<PrivateLayout><Collection saved /></PrivateLayout>} />
      <Route path="/my-posts" element={<PrivateLayout><Collection mine /></PrivateLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
