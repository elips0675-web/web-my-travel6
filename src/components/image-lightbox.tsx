'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import Image from 'next/image';
import { X } from 'lucide-react';
import { Button } from './ui/button';

interface ImageLightboxProps {
  images: string[];
  startIndex?: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ImageLightbox({ images, startIndex = 0, isOpen, onOpenChange }: ImageLightboxProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    const handleSelect = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
    };
    
    api.on('select', handleSelect);
    api.on('reInit', handleSelect);
    
    // Set initial state
    handleSelect();

    return () => {
        api.off('select', handleSelect);
        api.off('reInit', handleSelect);
    };
  }, [api]);

  useEffect(() => {
    if (!api || !isOpen) {
        return;
    }

    if (api.selectedScrollSnap() !== startIndex) {
        api.scrollTo(startIndex, true);
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowRight') {
            api.scrollNext();
        } else if (e.key === 'ArrowLeft') {
            api.scrollPrev();
        } else if (e.key === 'Escape') {
            onOpenChange(false);
        }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);

  }, [api, startIndex, isOpen, onOpenChange]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/90 border-0 p-0 max-w-full w-full h-full flex items-center justify-center">
        <DialogTitle className="sr-only">Галерея изображений</DialogTitle>
        <DialogDescription className="sr-only">
          Лайтбокс с галереей изображений. Используйте стрелки для навигации между изображениями или клавишу Escape для закрытия.
        </DialogDescription>
        <Carousel setApi={setApi} className="w-full h-full max-w-6xl">
          <CarouselContent className="h-full">
            {images.map((src, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <div className="relative w-full h-5/6">
                   <Image src={src} alt={`Lightbox image ${index + 1}`} fill className="object-contain" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
           <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/20 hover:bg-white/30 border-0 h-12 w-12" />
           <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white bg-white/20 hover:bg-white/30 border-0 h-12 w-12" />
        </Carousel>

        <div className="absolute top-4 right-4 text-white z-20">
          <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="hover:bg-white/20">
            <X className="h-8 w-8" />
          </Button>
        </div>
         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white z-20 bg-black/50 px-4 py-2 rounded-full text-sm">
            {current} / {count}
        </div>
      </DialogContent>
    </Dialog>
  );
}
