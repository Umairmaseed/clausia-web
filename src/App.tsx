import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './pages/Register';
import Otp from './pages/Otp';
import Login from './pages/Login';
import { AuthProvider } from './context/Authcontext'; 
import PrivateRoute from './components/PrivateRoute'; 

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
          <Route path="/home" element={<PrivateRoute element={<Home />} />} />
          </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
