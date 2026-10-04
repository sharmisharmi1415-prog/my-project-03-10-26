export default function Loading({ full = false }) {
  return <div className={`loading ${full ? 'loading-full' : ''}`} role="status" aria-label="Loading"><span /></div>;
}
