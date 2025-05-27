import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Inventory from './pages/Inventory';
import Cashier from './pages/Cashier';
import POS from './pages/POS';
import ProtectedRoute from './auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute role="INVENTORY">
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/cashier" element={
            <ProtectedRoute role="CASHIER">
              <Cashier />
            </ProtectedRoute>
          } />
          <Route path="/pos" element={
  <ProtectedRoute role={["ADMIN", "CASHIER"]}>
    <POS />
  </ProtectedRoute>
} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
