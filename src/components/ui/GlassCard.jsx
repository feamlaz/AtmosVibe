import clsx from 'clsx';

export default function GlassCard({ className, children }) {
  return <div className={clsx('glass-card', className)}>{children}</div>;
}
