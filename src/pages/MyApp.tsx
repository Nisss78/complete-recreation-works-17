import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const MyApp = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My App</h1>
        <div className="space-y-8">
          {/* Content will be added based on your next instructions */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyApp;