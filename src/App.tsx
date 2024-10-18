import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Otp from './pages/Otp'
import Login from './pages/Login'
import { AuthProvider } from './context/Authcontext'
import PrivateRoute from './context/PrivateRoute'
import Home from './pages/Home'
import Document from './pages/Document'
import CreateDocumentSigning from './pages/CreateDocumentSigning'
import ListDocument from './pages/ListDocument'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<Otp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute element={<Home />} />} />
          <Route
            path="/document"
            element={<PrivateRoute element={<Document />} />}
          />
          <Route
            path="/document/create"
            element={<PrivateRoute element={<CreateDocumentSigning />} />}
          />
          <Route
            path="/document/list"
            element={<PrivateRoute element={<ListDocument />} />}
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
