import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { format } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fetchProducts = async () => {
  // まず、プロダクトの基本情報とタグを取得
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

  // 各プロダクトのいいね数を取得
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

  // いいね数でソート（降順）
  return productsWithLikes.sort((a, b) => b.upvotes - a.upvotes);
};

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const { data: allProducts = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  // Group products by date
  const groupedProducts = allProducts.reduce((groups: any, product) => {
    const date = format(product.launchDate, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(product);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
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
      <div className="min-h-screen bg-white flex flex-col">
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold mb-8">Products Launching Today</h1>
          
          {Object.entries(groupedProducts).map(([date, products]: [string, any]) => (
            <div key={date} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                {format(new Date(date), 'MMMM d, yyyy')}
              </h2>
              <div className="space-y-4">
                {products.map((product: any) => (
                  <ProductCard 
                    key={`${product.id}-${date}`}
                    {...product}
                    onClick={() => setSelectedProduct(product)}
                  />
                ))}
              </div>
            </div>
          ))}

          {allProducts.length === 0 && (
            <div className="text-center text-gray-500 mt-4">
              まだ投稿されたプロダクトはありません。
              <br />
              最初の投稿者になりませんか？
            </div>
          )}
        </div>
      </main>

      <Footer />

      {selectedProduct && (
        <ProductDialog
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default Index;