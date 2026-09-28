// Re-mounts on every in-app navigation → gives each page a subtle fade-up entrance
// while the sidebar (in layout.js) stays put.
export default function Template({ children }) {
  return <div className="animate-fade-up">{children}</div>;
}
