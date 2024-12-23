import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";

const products = [
  {
    id: 1,
    name: "Websparks",
    description: "The AI software engineer that brings your ideas to life",
    icon: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop",
    tags: ["Developer Tools", "Artificial Intelligence"],
    upvotes: 294,
    comments: 23,
  },
  {
    id: 2,
    name: "Shortcutter",
    description: "A new hot key, every day",
    icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=64&h=64&fit=crop",
    tags: ["Education", "Development", "Web Design"],
    upvotes: 201,
    comments: 7,
  },
  {
    id: 3,
    name: "Ghost Jobs",
    description: "Bringing transparency to the job market",
    icon: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=64&h=64&fit=crop",
    tags: ["Chrome Extensions", "Hiring", "Social Networking"],
    upvotes: 172,
    comments: 5,
  },
  {
    id: 4,
    name: "GratitudeBuddy",
    description: "Daily gratitude journal app for mental wellbeing",
    icon: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=64&h=64&fit=crop",
    tags: ["Health & Fitness", "Lifestyle"],
    upvotes: 164,
    comments: 7,
  },
  {
    id: 5,
    name: "Home Assistant Voice",
    description: "A open, local, and private voice assistant for your home",
    icon: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=64&h=64&fit=crop",
    tags: ["Home Automation"],
    upvotes: 154,
    comments: 3,
  },
];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Top Products Launching Today</h1>
        
        <div className="space-y-4">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              {...product} 
              onClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

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