import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const StatisticsCard = ({ tickets = [] }) => {
  const safeTickets = Array.isArray(tickets) ? tickets : [];

  // 🎯 SERVICES (CAMEMBERT)
  const serviceMap = {};

  safeTickets.forEach((t) => {
    const service = t.serviceName || "Inconnu";
    serviceMap[service] = (serviceMap[service] || 0) + 1;
  });

  const pieData = Object.entries(serviceMap).map(([name, value]) => ({
    name,
    value,
  }));

  // ⏰ HEURES (HISTOGRAMME)
  const hourMap = {};

  safeTickets.forEach((t) => {
    if (!t.time) return;
    const hour = t.time.split(":")[0];
    hourMap[hour] = (hourMap[hour] || 0) + 1;
  });

  const barData = Object.entries(hourMap).map(([hour, value]) => ({
    hour: `${hour}h`,
    tickets: value,
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="space-y-8">

      {/* 🥧 CAMEMBERT */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">🥧 Répartition des services</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {pieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 HISTOGRAMME */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-4">📊 Tickets par heure</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <XAxis dataKey="hour" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="tickets" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};