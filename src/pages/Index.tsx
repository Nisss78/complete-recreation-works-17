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
        launchDate: new Date(product.created_at),
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
  });

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    setSelectedProduct(product);
    navigate(`/products/${productSlug}`, { replace: true });
  };

  const handleDialogClose = () => {
    console.log('Dialog closing, redirecting to home');
    setSelectedProduct(null);
    navigate('/', { replace: true });
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
          <div className="animate-pulse text-gray-500">{t('common.loading')}</div>
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

  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {t('index.productsTitle')}
                </h1>
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

            <div className="lg:col-span-1 order-first lg:order-last mb-6 lg:mb-0">
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
