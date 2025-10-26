import { useState, useEffect } from "react";
import { Routes } from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import GeneratingLoader from "./components/GeneratingLoader";
import { supabase } from "./integrations/supabase/client";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

// Simple preload for faster initial load
async function preloadData() {
  try {
    // Just warm up the connection and cache some basic data
    await supabase.from('products').select('id').limit(1);
  } catch (error) {
    console.error('Error warming up connection:', error);
  }
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Temporarily skip preloading due to Supabase connection timeout
      // const dataPromise = preloadData();

      // Ensure minimum loading time for smooth UX
      const minLoadingTime = new Promise(resolve => setTimeout(resolve, 1500));

      // Wait for minimum time only
      await minLoadingTime;

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <GeneratingLoader fullScreen />;
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