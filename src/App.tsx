
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { SupabaseSetup } from "@/components/auth/SupabaseSetup";
import { UpdatePasswordForm } from "@/components/auth/UpdatePasswordForm";
import { Header } from "@/components/layout/Header";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        return failureCount < 2;
      },
    },
  },
});

const AppContent = () => {
  const { user, loading, isConfigured } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPasswordReset, setShowPasswordReset] = useState(false);

  useEffect(() => {
    // Check if user is coming from password reset email
    const isReset = searchParams.get('reset') === 'true';
    if (isReset && user) {
      setShowPasswordReset(true);
    }
  }, [searchParams, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!isConfigured) {
    return <SupabaseSetup />;
  }

  if (!user) {
    return <LoginForm />;
  }

  // Show password reset form if user is authenticated and coming from reset link
  if (showPasswordReset) {
    return (
      <UpdatePasswordForm 
        onSuccess={() => {
          setShowPasswordReset(false);
          // Clear the reset parameter from URL
          window.history.replaceState({}, document.title, window.location.pathname);
        }} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Routes>
        <Route path="/news-harvest-digest-bot" element={<Dashboard />} />
        <Route path="/news-harvest-digest-bot/" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
