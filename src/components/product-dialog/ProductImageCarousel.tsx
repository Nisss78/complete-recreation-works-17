import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageCarouselProps {
  productName: string;
  images: string[];
}

export const ProductImageCarousel = ({ productName, images }: ProductImageCarouselProps) => {
  if (images.length === 0) return null;

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