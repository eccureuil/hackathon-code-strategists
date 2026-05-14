export default function Navbar() {
  return (
    <nav className="w-full p-4 shadow-md flex justify-between items-center bg-white">
      <h1 className="font-bold text-xl">
        Smart City Fianarantsoa
      </h1>

      <div className="flex gap-4 text-sm">
        <a href="/" className="hover:text-blue-500">Home</a>
        <a href="/map" className="hover:text-blue-500">Map</a>
        <a href="/places" className="hover:text-blue-500">Places</a>
      </div>
    </nav>
  );
}