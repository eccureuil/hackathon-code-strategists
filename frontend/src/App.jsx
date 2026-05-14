import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import PageCitoyen from './pages/PageCitoyen'
import PageAdmin from './pages/PageAdmin'
import Notification from './components/commun/Notification'

function App() {
  return (
    <BrowserRouter>
      <Notification />
      <h1 className="text-red-500 text-5xl text-center">Fianar Smart City</h1>

      <nav style={{ textAlign: 'center', margin: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📱 Citoyen</Link>
        <Link to="/admin">👑 Admin</Link>
      </nav>

      <Routes>
        <Route path="/" element={<PageCitoyen />} />
        <Route path="/admin" element={<PageAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App