import type { ReactNode } from "react";

export function DashboardCard({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return <section id={id} className={`dashboard-card ${className}`}>{children}</section>;
}

export function CardHeader({
  eyebrow,
  title,
  icon,
  action,
}: {
  eyebrow?: string;
  title: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="reusable-card-header">
      <div>
        {eyebrow && <small>{eyebrow}</small>}
        <div className="reusable-card-title">{icon}{title}</div>
      </div>
      {action}
    </div>
  );
}

export function ToolCard({
  icon,
  title,
  description,
  href = "#",
}: {
  icon: ReactNode;
  title: string;
  description: string;
  href?: string;
}) {
  return (
    <a href={href} className="tool-card">
      <span className="tool-card-icon">{icon}</span>
      <span className="tool-card-copy">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>
    </a>
  );
}
