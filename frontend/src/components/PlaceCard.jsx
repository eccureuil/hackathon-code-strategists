export default function PlaceCard({ place }) {
  return (
    <div className="p-3 border rounded-lg shadow-sm hover:shadow-md transition">
      <h2 className="font-bold text-lg">{place.name}</h2>

      <p className="text-sm text-gray-500">
        {place.category}
      </p>

      <p className="text-sm mt-1">
        {place.description?.slice(0, 100)}...
      </p>
    </div>
  );
}