import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Meetings from './pages/Meetings';
import MeetingDetails from './pages/MeetingDetails';
import MeetingForm from './pages/MeetingForm';
import Tasks from './pages/Tasks';
import Decisions from './pages/Decisions';
import Reports from './pages/Reports';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="meetings" element={<Meetings />} />
              <Route path="meetings/new" element={<MeetingForm />} />
              <Route path="meetings/:id" element={<MeetingDetails />} />
              <Route path="meetings/:id/edit" element={<MeetingForm />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="decisions" element={<Decisions />} />
              <Route path="reports" element={<Reports />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
