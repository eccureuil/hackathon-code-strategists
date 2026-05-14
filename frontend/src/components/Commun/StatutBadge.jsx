// frontend/src/components/commun/StatutBadge.jsx
const StatutBadge = ({ statut }) => {
  const config = {
    en_attente: { label: 'En attente', icon: '🟡', color: '#ffc107', bg: '#fff3cd' },
    en_cours: { label: 'En cours', icon: '🔵', color: '#17a2b8', bg: '#d1ecf1' },
    resolu: { label: 'Résolu', icon: '🟢', color: '#28a745', bg: '#d4edda' }
  };

  const { label, icon, color, bg } = config[statut] || { label: statut, icon: '⚪', color: '#6c757d', bg: '#f8f9fa' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      color: color,
      backgroundColor: bg,
      border: `1px solid ${color}`,
      whiteSpace: 'nowrap'
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </span>
  );
};

export default StatutBadge;