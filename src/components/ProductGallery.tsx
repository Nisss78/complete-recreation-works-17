import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop",
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop"
];

export const ProductGallery = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  return (
    <div className="relative mb-6">
      <ScrollArea className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 pb-4">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Product screenshot ${index + 1}`}
              className="w-full h-[400px] object-cover rounded-lg flex-shrink-0 transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </ScrollArea>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentImageIndex === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrentImageIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};