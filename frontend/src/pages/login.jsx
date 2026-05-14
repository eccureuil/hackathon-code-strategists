import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../hooks/useToast";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Login() {
  const [form, setForm] = useState({ email: "", mdp: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const addToast = useToast();

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "L'email est requis";
    if (!form.mdp) errs.mdp = "Le mot de passe est requis";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await API.post("/users/login", form);
      localStorage.setItem("token", res.data.token);
      addToast("Connexion réussie", "success");
      const user = res.data.user;
      navigate(user?.role === "admin" ? "/admin" : "/home");
    } catch (err) {
      addToast(err.response?.data?.message || "Email ou mot de passe incorrect", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-600 via-emerald-700 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            F
          </div>
          <h1 className="text-3xl font-bold text-white">Bienvenue</h1>
          <p className="text-emerald-200 mt-1">Connectez-vous à Smart City</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Mot de passe"
              name="mdp"
              type="password"
              value={form.mdp}
              onChange={handleChange}
              error={errors.mdp}
            />
            <Button type="submit" loading={loading} className="w-full justify-center" size="lg">
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
