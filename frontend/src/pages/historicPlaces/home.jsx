import { useEffect, useState, useMemo } from "react";
import API from "../../services/api";
import PlaceCard from "../../components/PlaceCard";
import PlaceModal from "../../components/PlaceModal";
import Map from "../../components/Map";
import { CardSkeleton } from "../../components/ui/Skeleton";

const categories = [
  { value: "", label: "Tous" },
  { value: "culturel", label: "Culturel" },
  { value: "religieux", label: "Religieux" },
  { value: "naturel", label: "Naturel" },
  { value: "colonial", label: "Colonial" },
  { value: "gastronomie", label: "Gastronomie" },
];

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePlace, setActivePlace] = useState(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await API.get("/historic-places");
        setPlaces(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  const filtered = useMemo(
    () =>
      activeCategory
        ? places.filter((p) => p.category === activeCategory)
        : places,
    [places, activeCategory]
  );

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
            Lieux historiques<br />de Fianarantsoa
          </h1>
          <p className="mt-3 text-emerald-100 text-base sm:text-lg max-w-xl">
            Découvrez le patrimoine culturel et historique de la ville aux mille collines.
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-emerald-200">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {places.length} lieu{places.length > 1 ? "x" : ""}
            </span>
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span>5 catégories</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters + View toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 self-start">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "grid" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Grille"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/>
              </svg>
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`p-2 rounded-md transition-colors ${
                viewMode === "map" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:text-slate-600"
              }`}
              title="Carte"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zM2.5 2a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zM1 10.5A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3zm6.5.5A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3zm1.5-.5a.5.5 0 00-.5.5v3a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-3a.5.5 0 00-.5-.5h-3z" clipRule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Map view */}
        {viewMode === "map" && (
          <div className="mb-6">
            <Map
              places={filtered}
              onPlaceClick={setActivePlace}
              className="h-[60vh]"
            />
          </div>
        )}

        {/* Grid view */}
        {viewMode === "grid" && (
          <>
            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-600">
                  {activeCategory ? "Aucun lieu dans cette catégorie" : "Aucun lieu trouvé"}
                </h3>
                <p className="text-sm text-slate-400 mt-1">
                  {activeCategory ? "Essayez une autre catégorie" : "Les lieux apparaîtront ici"}
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {filtered.length} lieu{filtered.length > 1 ? "x" : ""}
                    {activeCategory && ` · ${categories.find((c) => c.value === activeCategory)?.label}`}
                  </p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filtered.map((place) => (
                    <PlaceCard key={place._id} place={place} onClick={setActivePlace} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <PlaceModal place={activePlace} onClose={() => setActivePlace(null)} />
    </div>
  );
}
