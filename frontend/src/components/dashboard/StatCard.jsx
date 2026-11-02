export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "blue",
}) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon">
            <Icon size={20} />
          </div>
        )}
      </div>
      <div className="stat-card-value">{value}</div>
      {subtitle && <span className="stat-card-sub">{subtitle}</span>}
    </div>
  );
}
