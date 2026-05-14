export const MyTickets = ({ tickets }) => {
  return (
    <div className="space-y-3">
      {tickets.map((t) => (
        <div key={t.id} className="bg-white p-4 rounded-lg shadow">
          <h3>🎫 {t.number}</h3>
          <p>📅 {t.date} - ⏰ {t.time}</p>
          <p>🏢 {t.serviceName}</p>
          <p>📍 {t.counter}</p>
          <p>👨‍💼 {t.responsibleName}</p>
          <p>📌 {t.status}</p>
        </div>
      ))}
    </div>
  );
};