const colorMap = {
  religieux: "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-700 border-purple-200",
  colonial: "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 border-amber-200",
  culturel: "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 border-blue-200",
  naturel: "bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-700 border-emerald-200",
  gastronomie: "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-700 border-orange-200",
};

const dotColors = {
  religieux: "bg-purple-500",
  colonial: "bg-amber-500",
  culturel: "bg-blue-500",
  naturel: "bg-emerald-500",
  gastronomie: "bg-orange-500",
};

export default function Badge({ category, label, className = "" }) {
  const style = colorMap[category] || "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-600 border-slate-200";
  const dot = dotColors[category] || "bg-slate-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${style} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label || category}
    </span>
  );
}

export function RouteBadge({ lineName, color = "blue" }) {
  const colors = {
    blue: "from-blue-600 to-blue-500",
    indigo: "from-indigo-600 to-indigo-500",
    emerald: "from-emerald-600 to-emerald-500",
    amber: "from-amber-500 to-yellow-500",
    red: "from-red-600 to-red-500",
    purple: "from-purple-600 to-purple-500",
    cyan: "from-cyan-500 to-blue-500",
    pink: "from-pink-500 to-rose-500",
  };

  const gradient = colors[color] || colors.blue;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-bold rounded-lg shadow-sm`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      {lineName}
    </span>
  );
}
