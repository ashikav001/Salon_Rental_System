import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CustomerDashboard from './pages/CustomerDashboard';
import Assets from './pages/Assets';
// ...

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/services" element={<Services />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/assets" element={<Assets />} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
    path="/customer-dashboard"
    element={
        <ProtectedRoute allowedRoles={['customer']}>
            <CustomerDashboard />
        </ProtectedRoute>
    }
/>

      </Routes>
    </>
  );
}

export default App;