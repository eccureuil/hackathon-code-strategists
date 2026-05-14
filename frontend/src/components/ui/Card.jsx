export default function Card({
  children,
  className = "",
  hover = false,
  padding = true,
  glow = false,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white rounded-2xl border border-slate-100
        ${padding ? "p-5 sm:p-6" : ""}
        ${hover ? "cursor-pointer hover:shadow-lg hover:border-slate-200 hover:-translate-y-0.5" : "shadow-sm"}
        ${glow ? "shadow-lg shadow-indigo-500/5 ring-1 ring-indigo-500/10" : ""}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function GlassCard({ children, className = "", hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-2xl p-5 sm:p-6
        ${hover ? "cursor-pointer hover:-translate-y-0.5" : ""}
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, trend, color = "indigo" }) {
  const colors = {
    indigo: "from-indigo-500 to-violet-500",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-pink-500",
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-200">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</p>
          <p className="text-3xl sm:text-4xl font-bold text-slate-800 animate-count-up">{value}</p>
          {trend != null && (
            <p className={`text-xs font-medium ${trend >= 0 ? "text-emerald-500" : "text-red-500"}`}>
              {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </p>
          )}
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${colors[color] || colors.indigo} flex items-center justify-center shadow-lg shadow-${color}-500/20 flex-shrink-0`}>
            <span className="text-white text-lg leading-none">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
}
