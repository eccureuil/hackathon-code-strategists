const categoryColors = {
  religieux: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  colonial: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  culturel: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  naturel: { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" },
  gastronomie: { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
};

const categoryLabels = {
  religieux: "Religieux",
  colonial: "Colonial",
  culturel: "Culturel",
  naturel: "Naturel",
  gastronomie: "Gastronomie",
};

export default function Badge({ category, size = "sm" }) {
  const colors = categoryColors[category] || categoryColors.culturel;
  const sizeClasses = size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${colors.bg} ${colors.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {categoryLabels[category] || category}
    </span>
  );
}
