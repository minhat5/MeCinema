import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import AppLayout from './components/layout/AppLayout';
import AdminLayout from './components/layout/AdminLayout';
import HomePage from './pages/HomePage';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import MoviesPage from './features/movies/pages/MoviesPage';
import MovieDetailPage from './features/movies/pages/MovieDetailPage';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { adminRoutes } from './features/admin/routes';
import { ROLES } from '@shared/constants/roles';
import CinemaBrowsePage from './features/movies/pages/CinemaBrowsePage';
import ProfileInfoPage from './features/user/pages/ProfileInfoPage';
// Booking/Food modules are not ready yet.

function App() {
    const adminChildren =
        adminRoutes.find((route) => route.path === 'admin')?.children || [];

    return (
        <Routes>
            {/* App Layout Routes */}
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/phim" element={<MoviesPage />} />
                <Route path="/schedule" element={<div>Schedule Page</div>} />
                <Route path="/offers" element={<div>Offers Page</div>} />
                <Route path="/news" element={<div>News Page</div>} />

                {/* Movies / Cinema */}
                <Route path="/phim" element={<MoviesPage />} />
                <Route path="/phim/:slug" element={<MovieDetailPage />} />
                <Route path="/dien-anh" element={<CinemaBrowsePage />} />
                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
                {/* Movies */}

                <Route path="/phim/:slug" element={<MovieDetailPage />} />

                {/*
                  TODO: re-enable when booking/food UI modules are implemented.
                  <Route path="/booking/:slug/:showtimeId" ... />
                  <Route path="/booking/confirm/:bookingId" ... />
                  <Route path="/booking/result/:bookingId" ... />
                  <Route path="/order/food" ... />
                  <Route path="/order/food/confirm/:orderId" ... />
                */}
                {/* Persons feature is disabled */}
            </Route>

            {/* Auth Routes (without AppLayout) */}
            <Route
                path="/member"
                element={
                    <ProtectedRoute>
                        <ProfileInfoPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/infor"
                element={
                    <ProtectedRoute>
                        <ProfileInfoPage />
                    </ProtectedRoute>
                }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                {adminChildren.map((child) => (
                    <Route key={child.path} path={child.path} element={child.element} />
                ))}
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* 404 Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* Movies */}
            <Route path="/phim" element={<MoviesPage />} />
            <Route path="/phim/:slug" element={<MovieDetailPage />} />
        </Routes>
    );
}

export default App;