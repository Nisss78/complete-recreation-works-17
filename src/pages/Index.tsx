import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { format, subDays } from "date-fns";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const generateDemoProducts = (date: Date) => [
  {
    id: 1,
    name: "Websparks",
    tagline: "The AI software engineer that brings your ideas to life",
    description: "WebSparks is an AI Software Engineer that seamlessly manages your entire software development lifecycle, just like a human engineer. It simplifies application development by handling everything from planning to deployment, making software creation accessible to everyone.",
    icon: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop",
    tags: ["Developer Tools", "Artificial Intelligence"],
    upvotes: 294,
    comments: 23,
    launchDate: date,
  },
  {
    id: 2,
    name: "Shortcutter",
    tagline: "A new hot key, every day",
    description: "Shortcutter is your personal productivity companion that introduces you to a new keyboard shortcut every day. Learn to navigate your favorite applications like a pro, saving precious time and becoming more efficient in your daily workflow.",
    icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=64&h=64&fit=crop",
    tags: ["Education", "Development", "Web Design"],
    upvotes: 201,
    comments: 7,
    launchDate: date,
  },
  {
    id: 3,
    name: "Ghost Jobs",
    description: "Bringing transparency to the job market",
    icon: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=64&h=64&fit=crop",
    tags: ["Chrome Extensions", "Hiring", "Social Networking"],
    upvotes: 172,
    comments: 5,
    launchDate: date,
  },
  {
    id: 4,
    name: "GratitudeBuddy",
    description: "Daily gratitude journal app for mental wellbeing",
    icon: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=64&h=64&fit=crop",
    tags: ["Health & Fitness", "Lifestyle"],
    upvotes: 164,
    comments: 7,
    launchDate: date,
  },
  {
    id: 5,
    name: "Home Assistant Voice",
    description: "A open, local, and private voice assistant for your home",
    icon: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=64&h=64&fit=crop",
    tags: ["Home Automation"],
    upvotes: 154,
    comments: 3,
    launchDate: date,
  },
];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [visibleDays, setVisibleDays] = useState(3);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  const generateDates = (numDays: number) => {
    return Array.from({ length: numDays }, (_, i) => {
      const date = subDays(new Date(), i);
      return {
        date,
        products: generateDemoProducts(date),
      };
    });
  };

  useEffect(() => {
    const products = generateDates(visibleDays).flatMap(day => day.products);
    setAllProducts(products);
  }, [visibleDays]);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        === document.documentElement.offsetHeight
      ) {
        if (visibleDays < 14) {
          setVisibleDays(prev => Math.min(prev + 3, 14));
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleDays]);

  // Group products by date
  const groupedProducts = allProducts.reduce((groups: any, product) => {
    const date = format(product.launchDate, 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(product);
    return groups;
  }, {});

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

          {visibleDays < 14 && (
            <div className="text-center text-gray-500 mt-4">
              Scroll for more products...
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
