export default function EmptyState({
  icon,
  title = "Aucune donnée",
  description = "Il n'y a rien à afficher pour le moment.",
  action,
  compact = false,
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-8" : "py-16"}`}>
      {icon ? (
        <div className={`${compact ? "w-12 h-12" : "w-20 h-20"} rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-4`}>
          <span className={`${compact ? "text-2xl" : "text-4xl"}`}>{icon}</span>
        </div>
      ) : (
        <div className={`${compact ? "w-12 h-12" : "w-20 h-20"} rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center mb-4`}>
          <svg className={`${compact ? "w-6 h-6" : "w-10 h-10"} text-indigo-300`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
      )}
      <h3 className={`font-semibold text-slate-700 ${compact ? "text-sm" : "text-lg"}`}>{title}</h3>
      <p className={`text-slate-400 max-w-sm mt-1 ${compact ? "text-xs" : "text-sm"}`}>{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
