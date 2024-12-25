import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useBookmarks } from "@/hooks/useBookmarks";

const MyApp = () => {
  const { bookmarks, isLoading } = useBookmarks();
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const { t } = useLanguage();

  // Fetch complete product details when a product is selected
  const { data: productDetails } = useQuery({
    queryKey: ['product', selectedProduct?.id],
    queryFn: async () => {
      if (!selectedProduct?.id) return null;

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            image_url
          ),
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
      return data ? {
        id: data.id,
        name: data.name,
        tagline: data.tagline,
        description: data.description,
        icon: data.icon_url,
        tags: data.product_tags?.map((t: any) => t.tag) || [],
        upvotes: 0, // Default value since we don't have this in the database
        comments: 0  // This will be updated by the ProductCard component
      } : null;
    },
    enabled: !!selectedProduct?.id,
  });

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    setSelectedProduct(product);
  };

  const handleDialogClose = () => {
    setSelectedProduct(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="animate-pulse text-gray-500">{t('common.loading')}</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">{t('nav.myApp')}</h1>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bookmarks?.map((bookmark) => {
              const product = {
                id: bookmark.id,
                name: bookmark.name,
                tagline: bookmark.tagline,
                description: bookmark.description,
                icon: bookmark.icon_url,
                tags: bookmark.product_tags?.map((t: any) => t.tag) || [],
                upvotes: 0,
                comments: 0,
              };
              return (
                <ProductCard
                  key={bookmark.id}
                  {...product}
                  onClick={() => handleProductClick(bookmark)}
                />
              );
            })}
          </div>

          {selectedProduct && (
            <ProductDialog
              open={!!selectedProduct}
              onOpenChange={handleDialogClose}
              product={productDetails}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyApp;