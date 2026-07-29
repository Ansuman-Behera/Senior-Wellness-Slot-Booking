import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ServicesPage } from '../pages/ServicesPage';
import { ServiceDetailsPage } from '../pages/ServiceDetailsPage';
import { AvailableSlotsPage } from '../pages/AvailableSlotsPage';
import { BookingPage } from '../pages/BookingPage';
import { UserDashboardPage } from '../pages/UserDashboardPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';
import { ProfilePage } from '../pages/ProfilePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProtectedRoute, AdminRoute } from './ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:id" element={<ServiceDetailsPage />} />
        <Route path="/slots" element={<AvailableSlotsPage />} />

        {/* Member Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/dashboard" element={<UserDashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
