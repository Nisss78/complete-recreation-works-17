import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams, useNavigate } from "react-router-dom";
import { MetaTags } from "@/components/MetaTags";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

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
  const { productId } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  const { data: recentArticles = [] } = useQuery({
    queryKey: ['recentArticles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          profiles:profiles!articles_user_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (productId && allProducts.length > 0) {
      console.log('Looking for product with ID:', productId);
      const product = allProducts.find((p) => p.name.toLowerCase().replace(/\s+/g, '-') === productId);
      if (product) {
        console.log('Found product:', product);
        setSelectedProduct(product);
      } else {
        console.log('Product not found, redirecting to home');
        navigate('/', { replace: true });
      }
    }
  }, [productId, allProducts]);

  const handleProductClick = (product: any) => {
    console.log('Product clicked:', product);
    setSelectedProduct(product);
    const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/posts/${productSlug}`);
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

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50/50">
      <MetaTags 
        title="Products Launching Today | プロダクト一覧"
        description="今日立ち上がった新しいプロダクトをチェックしましょう。最新のイノベーションとクリエイティブなアイデアを発見できます。"
        image="og-image.png"
      />
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-4 sm:py-8 px-3 sm:px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Products Launching Today</h1>
                <button
                  onClick={() => setSortByLikes(!sortByLikes)}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                >
                  {sortByLikes ? t('products.sortByDate') : t('products.sortByLikes')}
                </button>
              </div>
              
              {Object.entries(groupedProducts).map(([date, products]: [string, any]) => (
                <div key={date} className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800">
                    {format(new Date(date), 'MMMM d, yyyy')}
                  </h2>
                  <div className="space-y-3 sm:space-y-4 bg-white rounded-xl shadow-sm border border-gray-200 divide-y">
                    {products.map((product: any) => (
                      <ProductCard 
                        key={`${product.id}-${date}`}
                        {...product}
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>
                </div>
              ))}

              {allProducts.length === 0 && (
                <div className="text-center text-gray-500 mt-8 p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
                  まだ投稿されたプロダクトはありません。
                  <br />
                  最初の投稿者になりませんか？
                </div>
              )}
            </div>

            {/* Recent Articles Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">最近の記事</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/articles')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    もっと見る
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentArticles.map((article: any) => (
                    <Card
                      key={article.id}
                      className="p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/articles/${article.id}`)}
                    >
                      <div className="flex gap-3">
                        {article.thumbnail_url && (
                          <img
                            src={article.thumbnail_url}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {article.profiles?.username || "Unknown User"}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {recentArticles.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                      まだ記事がありません
                    </p>
                  )}
                </div>
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
