import { useBookmarks } from "@/hooks/useBookmarks";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const MyApp = () => {
  const { bookmarks, isLoading } = useBookmarks();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/posts/${productSlug}`);
  };

  const handleDialogClose = () => {
    setSelectedProduct(null);
    navigate('/my-app');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading bookmarks...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Products</h1>
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              {t('bookmarks.empty')}
            </div>
          ) : (
            bookmarks.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                tagline={product.tagline}
                description=""
                icon={product.icon_url}
                tags={[]}
                comments={0}
                onClick={() => handleProductClick(product)}
              />
            ))
          )}
        </div>
      </main>
      <Footer />

      {selectedProduct && (
        <ProductDialog
          open={!!selectedProduct}
          onOpenChange={handleDialogClose}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default MyApp;