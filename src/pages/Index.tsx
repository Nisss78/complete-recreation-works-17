import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductDialog } from "@/components/ProductDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProductsList } from "@/components/home/ProductsList";
import { RecentArticles } from "@/components/home/RecentArticles";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import FloatingParticles from "@/components/FloatingParticles";
import FloatingLogos from "@/components/FloatingLogos";

// 製品データと画像を同時に取得する関数
const fetchProductsWithImages = async () => {
  console.log('Fetching products and images...');
  
  // 製品データを取得
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      product_tags (
        tag
      ),
      product_images (
        image_url
      )
    `)
    .order('created_at', { ascending: false });

  if (productsError) throw productsError;

  // いいね数とコメント数を取得して製品データと結合
  const productsWithData = await Promise.all(
    products.map(async (product) => {
      // いいね数を取得
      const { count: likesCount } = await supabase
        .from('product_likes')
        .select('*', { count: 'exact' })
        .eq('product_id', product.id);
      
      // コメント数を取得
      const { count: commentsCount } = await supabase
        .from('product_comments')
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
        upvotes: likesCount || 0,
        comments: commentsCount || 0,
        launchDate: product.created_at ? new Date(product.created_at) : new Date(),
        images: product.product_images?.map(img => img.image_url) || []
      };
    })
  );

  console.log('Fetched products with data:', productsWithData);
  return productsWithData;
};

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sortByLikes, setSortByLikes] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products-with-images'],
    queryFn: fetchProductsWithImages,
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Cache for 10 minutes
  });

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    setSelectedProduct(product);
  };

  const handleDialogClose = () => {
    console.log('Dialog closing');
    setSelectedProduct(null);
  };

  useEffect(() => {
    // Check for product parameter in URL query
    const searchParams = new URLSearchParams(location.search);
    const productSlug = searchParams.get('product');
    
    if (productSlug && allProducts.length > 0) {
      console.log('Looking for product with slug from query param:', productSlug);
      const product = allProducts.find(p => 
        p.name.toLowerCase().replace(/\s+/g, '-') === productSlug
      );
      
      if (product) {
        console.log('Found product from query param:', product);
        setSelectedProduct(product);
      }
    }
  }, [location.search, allProducts]);

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingScreen fullScreen={false} />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-red-500">
            {t('error.loading')}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const groupedProducts = allProducts.reduce((groups: any, product) => {
    // Check if launchDate is valid
    const dateToUse = product.launchDate && !isNaN(product.launchDate.getTime()) 
      ? product.launchDate 
      : new Date();
    const date = format(dateToUse, 'yyyy-MM-dd');
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

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-white relative overflow-hidden">
          <FloatingParticles />
          <FloatingLogos />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-28 md:pt-32 relative z-10">
            <h1 className="text-6xl font-bold mb-4 text-left" style={{
              background: 'linear-gradient(135deg, #7bc61e, #10c876, #15b8e5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              PRODUCTS
            </h1>
            <p className="text-xl text-gray-700 text-left">
              {t('index.productsTitle')}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto py-6 sm:py-8">
          <div className="px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="lg:col-span-2 order-first">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <button
                    onClick={() => setSortByLikes(!sortByLikes)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm gap-2"
                  >
                    {sortByLikes ? (
                      <>
                        <ArrowDownAZ className="h-4 w-4" />
                        <span className="whitespace-nowrap">{t('products.sortByDate')}</span>
                      </>
                    ) : (
                      <>
                        <ArrowUpAZ className="h-4 w-4" />
                        <span className="whitespace-nowrap">{t('products.sortByLikes')}</span>
                      </>
                    )}
                  </button>
                </div>

                <ProductsList
                  groupedProducts={groupedProducts}
                  onProductClick={handleProductClick}
                  sortByLikes={sortByLikes}
                />
              </div>

              <div className="lg:col-span-1 order-last mb-6 lg:mb-0">
                <RecentArticles />
              </div>
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
