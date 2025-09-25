import { useState, useEffect } from "react";
import { Routes } from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import "./App.css";

const queryClient = new QueryClient();

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial app loading (auth check, initial data fetch, etc.)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Show loading for at least 1.5 seconds for smooth UX

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen fullScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <BrowserRouter>
          <Routes />
          <Toaster />
        </BrowserRouter>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;