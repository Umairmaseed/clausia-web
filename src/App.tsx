import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Otp from './pages/Otp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/login" element={<></>} />
      </Routes>
    </Router>
  )
}

export default App
