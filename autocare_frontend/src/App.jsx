import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Layout from './components/Layout';
import CustomerLayout from './components/CustomerLayout';
import Login from './pages/Login';
import Home from './pages/Home';
import Customers from './pages/Customers';
import CustomerVehicles from './pages/CustomerVehicles';
import Mechanics from './pages/Mechanics';
import ServiceTypes from './pages/ServiceTypes';
import Spares from './pages/Spares';
import ServiceRequests from './pages/ServiceRequests';
import ServiceRequestDetail from './pages/ServiceRequestDetail';
import Bills from './pages/Bills';
import MyVehicles from './pages/MyVehicles';
import MyRequests from './pages/MyRequests';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/*Routes for the Staff for now( split it into A NAD M */}
          <Route
            element={
              <ProtectedRoute>
                <RoleRoute role="staff"><Layout /></RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id/vehicles" element={<CustomerVehicles />} />
            <Route path="/mechanics" element={<Mechanics />} />
            <Route path="/service-types" element={<ServiceTypes />} />
            <Route path="/spares" element={<Spares />} />
            <Route path="/service-requests" element={<ServiceRequests />} />
            <Route path="/service-requests/:id" element={<ServiceRequestDetail />} />
            <Route path="/bills" element={<Bills />} />
          </Route>

          {/* Routes for the customer */}
          <Route
            path="/my"
            element={
              <ProtectedRoute>
                <RoleRoute role="customer"><CustomerLayout /></RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="vehicles" element={<MyVehicles />} />
            <Route path="requests" element={<MyRequests />} />
            <Route path="requests/:id" element={<ServiceRequestDetail />} />
            <Route path="bills" element={<Bills />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}