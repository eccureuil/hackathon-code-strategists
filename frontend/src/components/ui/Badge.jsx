const statusStyles = {
  confirmed:
    "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-500/20",
  completed:
    "bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-500/20",
  cancelled:
    "bg-slate-50 text-slate-500 border-slate-200 ring-1 ring-slate-500/10",
  absent:
    "bg-rose-50 text-rose-700 border-rose-200 ring-1 ring-rose-500/20",
  waiting:
    "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-500/20",
  processing:
    "bg-indigo-50 text-indigo-700 border-indigo-200 ring-1 ring-indigo-500/20",
};

const statusLabels = {
  confirmed: "Confirmé",
  completed: "Traité",
  cancelled: "Annulé",
  absent: "Absent",
  waiting: "En attente",
  processing: "En cours",
};

export function StatusBadge({ status, className = "" }) {
  const style = statusStyles[status] || statusStyles.confirmed;
  const label = statusLabels[status] || status;

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border
        ${style} ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${status === "confirmed" ? "bg-emerald-500 animate-pulse-soft" : status === "processing" ? "bg-indigo-500 animate-pulse-soft" : status === "completed" ? "bg-blue-500" : status === "cancelled" ? "bg-slate-400" : status === "absent" ? "bg-rose-500" : "bg-amber-500"}`} />
      {label}
    </span>
  );
}

export function CategoryBadge({ category }) {
  const colors = {
    religieux: "bg-purple-100 text-purple-700 border-purple-200",
    colonial: "bg-amber-100 text-amber-700 border-amber-200",
    culturel: "bg-blue-100 text-blue-700 border-blue-200",
    naturel: "bg-emerald-100 text-emerald-700 border-emerald-200",
    gastronomie: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider border ${colors[category] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${category === "religieux" ? "bg-purple-500" : category === "colonial" ? "bg-amber-500" : category === "culturel" ? "bg-blue-500" : category === "naturel" ? "bg-emerald-500" : "bg-orange-500"}`} />
      {category}
    </span>
  );
}

const Badge = CategoryBadge;
export default Badge;

export function RouteBadge({ label, color }) {
  const colorMap = [
    "from-violet-500 to-purple-600",
    "from-blue-500 to-cyan-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-indigo-500 to-blue-600",
    "from-teal-500 to-emerald-600",
    "from-pink-500 to-rose-600",
  ];
  const idx = color || (label?.length || 0) % colorMap.length;

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white bg-linear-to-r ${colorMap[idx]} shadow-sm`}>
      {label}
    </span>
  );
}
