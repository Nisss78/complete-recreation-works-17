import { Routes } from "./Routes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import { BrowserRouter } from "react-router-dom";
import "./App.css";

const queryClient = new QueryClient();

function App() {
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