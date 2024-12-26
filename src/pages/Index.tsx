import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDialog } from "@/components/ProductDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductsList } from "@/components/home/ProductsList";
import { RecentArticles } from "@/components/home/RecentArticles";

const fetchProducts = async () => {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_tags (
        tag
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const productsWithLikes = await Promise.all(
    products.map(async (product) => {
      const { count } = await supabase
        .from('product_likes')
        .select('*', { count: 'exact' })
        .eq('product_id', product.id);

      return {
        id: product.id,
        name: product.name,
        tagline: product.tagline,
        description: product.description,
        icon: product.icon_url,
        URL: product.URL,
        tags: product.product_tags?.map(t => t.tag) || [],
        upvotes: count || 0,
        comments: 0,
        launchDate: new Date(product.created_at),
      };
    })
  );

  return productsWithLikes;
};

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sortByLikes, setSortByLikes] = useState(false);
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    setSelectedProduct(product);
    navigate(`/products/${product.id}`);
  };

  const handleDialogClose = () => {
    console.log('Dialog closing, redirecting to home');
    setSelectedProduct(null);
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading products...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-red-500">
            Error loading products. Please try again later.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const groupedProducts = allProducts.reduce((groups: any, product) => {
    const date = format(product.launchDate, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(product);
    return groups;
  }, {});

  if (sortByLikes) {
    Object.keys(groupedProducts).forEach(date => {
      groupedProducts[date].sort((a: any, b: any) => b.upvotes - a.upvotes);
    });
  }

  // 製品IDがURLにある場合、その製品を表示
  useEffect(() => {
    if (productId) {
      const product = allProducts.find(p => p.id === parseInt(productId));
      if (product) {
        setSelectedProduct(product);
      }
    }
  }, [productId, allProducts]);

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
      <MetaTags 
        title={t('index.title')}
        description={t('index.description')}
        image="og-image.png"
      />
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                  {t('index.productsTitle')}
                </h1>
                <button
                  onClick={() => setSortByLikes(!sortByLikes)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  {sortByLikes ? t('products.sortByDate') : t('products.sortByLikes')}
                </button>
              </div>
              
              <ProductsList 
                groupedProducts={groupedProducts}
                onProductClick={handleProductClick}
                sortByLikes={sortByLikes}
              />
            </div>

            <div className="lg:col-span-1">
              <RecentArticles />
            </div>
          </div>
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

export default Index;
