import { useState, useEffect } from 'react'

let addNotificationGlobal = null

export const showNotification = (message, type = 'info') => {
  if (addNotificationGlobal) {
    addNotificationGlobal(message, type)
  }
}

const Notification = () => {
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    addNotificationGlobal = (message, type) => {
      const id = Date.now()
      setNotifications(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id))
      }, 5000)
    }
    return () => { addNotificationGlobal = null }
  }, [])

  const getStyle = (type) => {
    switch(type) {
      case 'success': return { backgroundColor: '#d4edda', color: '#155724', borderLeft: '4px solid #28a745' }
      case 'error': return { backgroundColor: '#f8d7da', color: '#721c24', borderLeft: '4px solid #dc3545' }
      case 'warning': return { backgroundColor: '#fff3cd', color: '#856404', borderLeft: '4px solid #ffc107' }
      default: return { backgroundColor: '#d1ecf1', color: '#0c5460', borderLeft: '4px solid #17a2b8' }
    }
  }

  return (
    <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {notifications.map(notif => (
        <div key={notif.id} style={{ ...getStyle(notif.type), padding: '12px 20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', minWidth: '250px', maxWidth: '350px' }}>
          {notif.message}
        </div>
      ))}
    </div>
  )
}

export default Notification
