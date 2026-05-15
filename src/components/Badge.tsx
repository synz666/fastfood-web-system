export function Badge({ children, tone = 'default' }: { children: React.ReactNode; tone?: 'default' | 'accent' | 'success' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
