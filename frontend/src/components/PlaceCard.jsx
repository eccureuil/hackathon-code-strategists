import Badge from "./ui/Badge";

const API_BASE = "http://localhost:5050";

export default function PlaceCard({ place, onClick }) {
  const heroImage = place.photos?.length > 0 ? `${API_BASE}/${place.photos[0]}` : null;

  return (
    <article
      onClick={() => onClick?.(place)}
      className="group cursor-pointer bg-white rounded-xl border border-slate-200 overflow-hidden
        shadow-sm hover:shadow-xl transition-all duration-300
        hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
        {heroImage ? (
          <img
            src={heroImage}
            alt={place.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge category={place.category} />
        </div>
        {place.featured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
            En vedette
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-slate-800 text-base leading-snug line-clamp-1 group-hover:text-emerald-600 transition-colors">
          {place.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {place.description}
        </p>
        {place.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {place.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {place.tags.length > 3 && (
              <span className="text-xs text-slate-400">+{place.tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
