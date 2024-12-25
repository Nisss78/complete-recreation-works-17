import { useBookmarks } from "@/hooks/useBookmarks";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: number;
  name: string;
  tagline: string;
  description: string;
  icon_url: string;
  URL: string | null;
  tags: string[];
  upvotes: number;
  comments: number;
}

const MyApp = () => {
  const { bookmarks, isLoading } = useBookmarks();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Fetch complete product details when a product is selected
  const { data: productDetails } = useQuery({
    queryKey: ['product', selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct?.id) return null;

      console.log('Fetching complete product details for:', selectedProduct.id);
      
      const { data: product, error } = await supabase
        .from('products')
        .select(`
          *,
          product_tags (
            tag
          )
        `)
        .eq('id', selectedProduct.id)
        .single();

      if (error) {
        console.error('Error fetching product details:', error);
        throw error;
      }

      // Transform the data to match the expected format
      return {
        ...product,
        icon: product.icon_url,
        tags: product.product_tags?.map((pt: { tag: string }) => pt.tag) || [],
        upvotes: 0, // You might want to fetch the actual upvotes count
        comments: 0, // You might want to fetch the actual comments count
      };
    },
    enabled: !!selectedProduct?.id,
  });

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
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

      {selectedProduct && productDetails && (
        <ProductDialog
          open={!!selectedProduct}
          onOpenChange={handleDialogClose}
          product={{
            ...productDetails,
            icon: productDetails.icon_url,
          }}
        />
      )}
    </div>
  );
};

export default MyApp;