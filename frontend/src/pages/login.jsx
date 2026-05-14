import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    mdp: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 // Dans Login.jsx, modifiez la fonction handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await API.post("/auth/login", form);
    localStorage.setItem("token", response.data.token)
    // Appeler le callback du parent
    props.onLogin(response.data.user, response.data.token);
    
    // Redirection selon le rôle
    if (response.data.user.role === "admin") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/client";
    }
  } catch (err) {
    alert(err.response?.data?.message || "Erreur de connexion");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Bienvenue 👋
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Connecte-toi à Smart City
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="mdp"
            type="password"
            placeholder="Mot de passe"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition">
            Se connecter
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas de compte ?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>

      </div>
    </div>
  );
}