import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import { ThemeProvider } from './context/ThemeContext';
import ThemeButton from './components/ThemeButton';
import Customers from './pages/Customers';


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
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}