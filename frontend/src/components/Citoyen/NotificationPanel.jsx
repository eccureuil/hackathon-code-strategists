export const NotificationPanel = ({ notifications }) => {
  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n._id}
          className={`p-3 rounded-lg ${
            n.read ? "bg-gray-100" : "bg-yellow-200"
          }`}
        >
          🔔 {n.message}
        </div>
      ))}
    </div>
  );
};