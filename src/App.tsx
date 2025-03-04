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
import Layout from './components/layout'
import DocumentDetail from './pages/DocumentDetail'
import PendingSignatures from './pages/ListPendingSignatures'
import SignDocument from './pages/SignDocument'
import Contract from './pages/ContractDashboard'
import Invite from './pages/Invite'
import ContractView from './pages/ContractView'
import ClauseDashboard from './pages/ClauseDashboard'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
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
            <Route
              path="/document/detail"
              element={<PrivateRoute element={<DocumentDetail />} />}
            />
            <Route
              path="/document/pending"
              element={<PrivateRoute element={<PendingSignatures />} />}
            />
            <Route
              path="/document/sign"
              element={<PrivateRoute element={<SignDocument />} />}
            />
            <Route
              path="/contract"
              element={<PrivateRoute element={<Contract />} />}
            />
            <Route
              path="/contract/view/:id"
              element={<PrivateRoute element={<ContractView />} />}
            />
            <Route
              path="/clause/view/:id"
              element={<PrivateRoute element={<ClauseDashboard />} />}
            />
            <Route
              path="/invite/accept"
              element={<PrivateRoute element={<Invite />} />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
