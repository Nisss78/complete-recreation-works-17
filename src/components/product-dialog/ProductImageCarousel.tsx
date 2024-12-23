import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

interface ProductImageCarouselProps {
  productName: string;
  images: string[];
}

export const ProductImageCarousel = ({ productName, images }: ProductImageCarouselProps) => {
  console.log("ProductImageCarousel received images:", images);

  if (!images || images.length === 0) {
    return (
      <div className="mt-8 mb-8 flex flex-col items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
        <p className="text-gray-500 dark:text-gray-400">
          説明画像はありません
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8">
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="flex items-center justify-center p-4">
                <img
                  src={image}
                  alt={`${productName} の説明画像 ${index + 1}`}
                  className="max-w-full max-h-[500px] object-contain rounded-lg"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2">
              <ChevronLeft className="w-4 h-4" />
            </CarouselPrevious>
            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2">
              <ChevronRight className="w-4 h-4" />
            </CarouselNext>
          </>
        )}
      </Carousel>
    </div>
  );
};