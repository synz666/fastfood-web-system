interface StatCardProps {
  value: string;
  label: string;
  unit?: string;
}

export function StatCard({ value, label, unit }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card-value-row">
        <strong className="stat-card-value">{value}</strong>
        {unit ? <span className="stat-card-unit">{unit}</span> : null}
      </div>
      <span className="stat-card-label">{label}</span>
    </div>
  );
}
