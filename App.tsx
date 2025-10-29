import React, { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { ClassesPage } from "./pages/ClassesPage";
import { ClassDetailPage } from "./pages/ClassDetailPage";
import { AuthPages } from "./pages/AuthPages";
import { DashboardPage } from "./pages/DashboardPage";
import { AboutPage } from "./pages/AboutPage";
import { ContactPage } from "./pages/ContactPage";
import { CreateEditClassPage } from "./pages/CreateEditClassPage";
import { ProfilePage } from "./pages/ProfilePage";
import { Toaster } from "./components/ui/sonner";
import { PreferenceQuestionnaire } from "./components/PreferenceQuestionnaire";
import { LearningModulePage } from "./pages/LearningModulePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { ProductDetailPage } from "./pages/ProductDetailPage";

type PageType =
  | "home"
  | "classes"
  | "class-detail"
  | "about"
  | "contact"
  | "login"
  | "register"
  | "preferences"
  | "dashboard"
  | "profile"
  | "create-class"
  | "edit-class"
  | "learning-module"
  | "marketplace"
  | "product-detail";

export default function App() {
  const [currentPage, setCurrentPage] =
    useState<PageType>("home");
  const [selectedClassId, setSelectedClassId] =
    useState<string>("");
  const [editingClassId, setEditingClassId] =
    useState<string>("");
  const [learningBookingId, setLearningBookingId] =
    useState<string>("");
  const [selectedProductId, setSelectedProductId] =
    useState<string>("");

  const handlePageChange = (page: string) => {
    setCurrentPage(page as PageType);
  };

  const handleClassSelect = (classId: string) => {
    setSelectedClassId(classId);
    setCurrentPage("class-detail");
  };

  const handleEditClass = (classId: string) => {
    setEditingClassId(classId);
    setCurrentPage("edit-class");
  };

  const handleStartLearning = (classId: string, bookingId: string) => {
    setSelectedClassId(classId);
    setLearningBookingId(bookingId);
    setCurrentPage("learning-module");
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentPage("product-detail");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onPageChange={handlePageChange}
            onClassSelect={handleClassSelect}
          />
        );

      case "classes":
        return (
          <ClassesPage onClassSelect={handleClassSelect} />
        );

      case "class-detail":
        return (
          <ClassDetailPage
            classId={selectedClassId}
            onBack={() => setCurrentPage("classes")}
            onPageChange={handlePageChange}
            onStartLearning={handleStartLearning}
          />
        );

      case "learning-module":
        return (
          <LearningModulePage
            classId={selectedClassId}
            bookingId={learningBookingId}
            onBack={() => setCurrentPage("dashboard")}
          />
        );

      case "about":
        return <AboutPage />;

      case "contact":
        return <ContactPage />;

      case "login":
        return (
          <AuthPages
            page="login"
            onPageChange={handlePageChange}
          />
        );

      case "register":
        return (
          <AuthPages
            page="register"
            onPageChange={handlePageChange}
          />
        );

      case "preferences":
        return (
          <PreferenceQuestionnaire
            onComplete={() => handlePageChange("dashboard")}
            onSkip={() => handlePageChange("dashboard")}
          />
        );

      case "dashboard":
        return (
          <DashboardPage
            onPageChange={handlePageChange}
            onClassSelect={handleClassSelect}
            onEditClass={handleEditClass}
            onStartLearning={handleStartLearning}
            onProductSelect={handleProductSelect}
          />
        );

      case "profile":
        return (
          <ProfilePage
            onBack={() => setCurrentPage("dashboard")}
          />
        );

      case "create-class":
        return (
          <CreateEditClassPage
            onBack={() => setCurrentPage("dashboard")}
          />
        );

      case "edit-class":
        return (
          <CreateEditClassPage
            classId={editingClassId}
            onBack={() => setCurrentPage("dashboard")}
          />
        );

      case "marketplace":
        return (
          <MarketplacePage
            onProductSelect={handleProductSelect}
          />
        );

      case "product-detail":
        return (
          <ProductDetailPage
            productId={selectedProductId}
            onBack={() => setCurrentPage("marketplace")}
            onArtisanClick={(artisanId) => {
              // Could add artisan profile page in future
              console.log("View artisan:", artisanId);
            }}
          />
        );

      default:
        return (
          <HomePage
            onPageChange={handlePageChange}
            onClassSelect={handleClassSelect}
          />
        );
    }
  };

  // For auth pages, don't use the main layout
  if (currentPage === "login" || currentPage === "register" || currentPage === "preferences") {
    return (
      <AuthProvider>
        {renderPage()}
        <Toaster />
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
        <main className="flex-1">{renderPage()}</main>
        <Footer />
      </div>
      <Toaster />
    </AuthProvider>
  );
}