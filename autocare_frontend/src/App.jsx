import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import ThemeButton from './components/ThemeButton';
import Customers from './pages/Customers';
import CustomerVehicles from './pages/CustomerVehicles';
import Mechanics from './pages/Mechanics';
import ServiceTypes from './pages/ServiceTypes';
import ServiceRequests from './pages/ServiceRequests';
import ServiceRequestDetail from './pages/ServiceRequestDetail';
import Spares from './pages/Spares';
import Bills from './pages/Bills';


export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider> 
      <BrowserRouter>
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1000 }}>
            <ThemeButton />
          </div>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
          <Route path="/customers/:id/vehicles" element={<ProtectedRoute><CustomerVehicles /></ProtectedRoute>} />
          <Route path="/mechanics" element={<ProtectedRoute><Mechanics /></ProtectedRoute>} />
          <Route path="/service-types" element={<ProtectedRoute><ServiceTypes /></ProtectedRoute>} />
          <Route path="/service-requests" element={<ProtectedRoute><ServiceRequests /></ProtectedRoute>} /> 
          <Route path="/service-requests/:id" element={<ProtectedRoute><ServiceRequestDetail /></ProtectedRoute>} />
          <Route path="/spares" element={<ProtectedRoute><Spares /></ProtectedRoute>} />
            <Route path="/bills" element={<ProtectedRoute><Bills /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
