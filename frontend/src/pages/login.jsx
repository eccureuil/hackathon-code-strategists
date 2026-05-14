import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { showToast } from "../components/ui/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", mdp: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.mdp) return showToast("Veuillez remplir tous les champs", "error");
    setLoading(true);
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      showToast("Connexion réussie", "success");
      const role = res.data.user?.role;
      navigate(role === "admin" ? "/admin" : "/citizen");
    } catch (err) {
      showToast(err.response?.data?.message || "Échec de la connexion", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/20">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800">Connexion</h1>
            <p className="text-sm text-slate-400 mt-1">Connectez-vous à votre espace</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />
            <Input
              label="Mot de passe"
              name="mdp"
              type="password"
              value={form.mdp}
              onChange={(e) => setForm({ ...form, mdp: e.target.value })}
              required
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
            <div className="pt-2">
              <Button type="submit" fullWidth loading={loading} size="lg">
                Se connecter
              </Button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-400 mt-8">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
