// frontend/src/components/admin/StatisticsCard.jsx
export const StatisticsCard = ({ stats }) => {
  const charts = [
    { label: "Tickets par heure", data: [5, 8, 12, 10, 7, 4] },
    { label: "Services les plus demandés", data: [
      { name: "Acte naissance", value: 45 },
      { name: "Certificat", value: 30 },
      { name: "Carte identité", value: 25 },
    ]},
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">📈 Aperçu journalier</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Tickets traités</span>
                <span className="font-medium">{stats.completedTickets} / {stats.todayTickets}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(stats.completedTickets / stats.todayTickets) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Taux d'absentéisme</span>
                <span className="font-medium">{((stats.absentTickets / stats.todayTickets) * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(stats.absentTickets / stats.todayTickets) * 100}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Temps d'attente moyen</span>
                <span className="font-bold text-blue-600">{stats.avgWaitTime} minutes</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-gray-600">Temps disponible restant</span>
                <span className="font-bold text-green-600">{stats.availableMinutes} minutes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-800 mb-4">🎯 État du service</h3>
          <div className="text-center py-4">
            <div className="text-5xl font-bold text-blue-600 mb-2">{stats.waitingTickets}</div>
            <div className="text-gray-500">Tickets en attente</div>
            <div className="mt-4 h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(stats.waitingTickets / 20) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Capacité maximale : 20 tickets simultanés</p>
          </div>
        </div>
      </div>

      {/* Graphiques simplifiés (pour la démo) */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">📊 Répartition par service</h3>
        <div className="space-y-3">
          {charts[1].data.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span className="font-medium">{item.value} tickets</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  style={{ width: `${(item.value / 50) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};