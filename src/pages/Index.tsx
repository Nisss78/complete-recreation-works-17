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

  // いいね数を取得して製品データと結合
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
        images: product.product_images?.map(img => img.image_url) || []
      };
    })
  );

  console.log('Fetched products with images:', productsWithLikes);
  return productsWithLikes;
};

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [sortByLikes, setSortByLikes] = useState(false);
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // 製品データと画像を同時に取得
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products-with-images'],
    queryFn: fetchProductsWithImages,
  });

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    const slug = product.name.toLowerCase().replace(/\s+/g, '-');
    setSelectedProduct(product);
    navigate(`/products/${slug}`);
  };

  const handleDialogClose = () => {
    console.log('Dialog closing, redirecting to home');
    setSelectedProduct(null);
    navigate('/', { replace: true });
  };

  useEffect(() => {
    if (productId && allProducts.length > 0) {
      const slug = window.location.pathname.split('/products/')[1];
      if (slug) {
        const product = allProducts.find(p => 
          p.name.toLowerCase().replace(/\s+/g, '-') === slug
        );
        if (product) {
          setSelectedProduct(product);
        }
      }
    }
  }, [productId, allProducts]);

  // ローディング状態の表示
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
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
