import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mdp: "",
    quartier: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/register", form);
      alert("Compte créé 🎉");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-emerald-700 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Créer un compte
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Rejoins Smart City Fianarantsoa
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="name"
            placeholder="Nom complet"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            name="mdp"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <input
            name="quartier"
            placeholder="Quartier"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          <button className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition">
            Créer compte
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-green-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>

      </div>
    </div>
  );
}