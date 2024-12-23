import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductDialog } from "@/components/ProductDialog";
import { format, subDays } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 過去7日分のデータを生成
const generateDates = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  });
};

const products = [
  {
    id: 1,
    name: "Websparks",
    description: "The AI software engineer that brings your ideas to life",
    icon: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=64&h=64&fit=crop",
    tags: ["Developer Tools", "Artificial Intelligence"],
    upvotes: 294,
    comments: 23,
    launchDate: "2024-04-10",
  },
  {
    id: 2,
    name: "Shortcutter",
    description: "A new hot key, every day",
    icon: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=64&h=64&fit=crop",
    tags: ["Education", "Development", "Web Design"],
    upvotes: 201,
    comments: 7,
    launchDate: "2024-04-09",
  },
  {
    id: 3,
    name: "Ghost Jobs",
    description: "Bringing transparency to the job market",
    icon: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=64&h=64&fit=crop",
    tags: ["Chrome Extensions", "Hiring", "Social Networking"],
    upvotes: 172,
    comments: 5,
    launchDate: "2024-04-08",
  },
  {
    id: 4,
    name: "GratitudeBuddy",
    description: "Daily gratitude journal app for mental wellbeing",
    icon: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=64&h=64&fit=crop",
    tags: ["Health & Fitness", "Lifestyle"],
    upvotes: 164,
    comments: 7,
    launchDate: "2024-04-07",
  },
  {
    id: 5,
    name: "Home Assistant Voice",
    description: "A open, local, and private voice assistant for your home",
    icon: "https://images.unsplash.com/photo-1483058712412-4245e9b90334?w=64&h=64&fit=crop",
    tags: ["Home Automation"],
    upvotes: 154,
    comments: 3,
    launchDate: "2024-04-06",
  },
];

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  const dates = generateDates();
  const filteredProducts = products.filter(product => product.launchDate === selectedDate);

  const formatDisplayDate = (date: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');
    
    if (date === today) return "Today";
    if (date === yesterday) return "Yesterday";
    return format(new Date(date), 'MMM d');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Products Launching {selectedDate === format(new Date(), 'yyyy-MM-dd') ? 'Today' : formatDisplayDate(selectedDate)}</h1>
          
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date" />
            </SelectTrigger>
            <SelectContent>
              {dates.map((date) => (
                <SelectItem key={date} value={date}>
                  {formatDisplayDate(date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
                onClick={() => setSelectedProduct(product)}
              />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products launched on this date
            </div>
          )}
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