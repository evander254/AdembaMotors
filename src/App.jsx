import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedVehicles from './components/FeaturedVehicles';
import Footer from './components/Footer';
import AdminLogin from './components/Admin/AdminLogin';
import Dashboard from './components/Admin/Dashboard';
import AddInventory from './components/Admin/AddInventory';
import ManageInventory from './components/Admin/ManageInventory';
import EditCar from './components/Admin/EditCar';
import ViewCar from './components/ViewCar';
import SearchResults from './components/SearchResults';
import Inventory from './components/Inventory';
import Services from './components/Services';
import Contact from './components/Contact';

// Landing Page Component
const LandingPage = () => {
  return (
    <>
      <Header />
      <main className="pt-20">
        <Hero />
        <FeaturedVehicles />
      </main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/car/:id" element={<ViewCar />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-inventory" element={<AddInventory />} />
          <Route path="/admin/inventory/view" element={<ManageInventory mode="view" />} />
          <Route path="/admin/inventory/edit" element={<ManageInventory mode="edit" />} />
          <Route path="/admin/inventory/delete" element={<ManageInventory mode="delete" />} />
          <Route path="/admin/edit-car/:id" element={<EditCar />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
