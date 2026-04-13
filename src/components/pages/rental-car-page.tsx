'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon, Loader2, Search, Users, Briefcase, Cog, DoorClosed, Star } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { type AiRentalCarRecommendationsOutput } from '@/ai/flows/ai-rental-car-recommendations';
import { RentalCarFilters } from "@/components/rental-car-filters";
import { Skeleton } from "@/components/ui/skeleton";

type CarRecommendation = AiRentalCarRecommendationsOutput['recommendations'][0];
type CarRecommendationWithSlug = CarRecommendation & { slug: string };

const formSchema = z.object({
  location: z.string().min(2, { message: "Место получения должно содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
});

const generateSlug = (name: string, index: number) => {
    const rusToLat: { [key: string]: string } = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
        'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
        'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
        'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
    };
    return name.toLowerCase()
        .split('').map(char => rusToLat[char] || char).join('')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-') + `-${index}`;
};

function CarCard({ car, index }: { car: CarRecommendationWithSlug, index: number }) {
    return (
      <Card className="group overflow-hidden">
        <div className="relative overflow-hidden">
          <Image
            src={car.imageUrl || `https://picsum.photos/seed/car${index}/800/600`}
            alt={car.name}
            width={800}
            height={600}
            className="object-cover h-full w-full aspect-video group-hover:scale-105 transition-transform duration-300"
            data-ai-hint={`${car.type.toLowerCase()} car`}
          />
        </div>
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                    <CardDescription>{car.type}</CardDescription>
                    <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{car.name}</CardTitle>
                </div>
                {car.rating && (
                    <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{car.rating.toFixed(1)}</span>
                    </div>
                )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-muted-foreground border-t border-b py-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{car.features.passengers}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{car.features.luggage}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Cog className="w-4 h-4" />
                    <span>{car.features.transmission}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DoorClosed className="w-4 h-4" />
                    <span>{car.features.doors}</span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <span className="text-muted-foreground text-sm">От </span>
                    <span className="font-bold text-xl">{car.pricePerDay}</span>
                    <span className="text-muted-foreground text-sm"> / день</span>
                </div>
                <Button asChild>
                    <Link href={`/rental-car/${car.slug}`}>Забронировать</Link>
                </Button>
            </div>
        </div>
      </Card>
    );
}
  
function LoadingSkeleton() {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-6 w-12" />
                </div>
                <div className="grid grid-cols-4 gap-4 py-4 border-t border-b">
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-full" />
                </div>
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-28" />
                </div>
            </div>
          </Card>
        ))}
      </div>
    );
}

const mockCarData: AiRentalCarRecommendationsOutput = {
    recommendations: [
        { name: "Kia Rio", type: "Эконом", supplier: "Local Rent", pricePerDay: "₽2500", rating: 4.5, features: { passengers: 5, luggage: 2, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/kiario/800/600" },
        { name: "Volkswagen Polo", type: "Эконом", supplier: "Profi-Car", pricePerDay: "₽2800", rating: 4.6, features: { passengers: 5, luggage: 2, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/vwpolo/800/600" },
        { name: "Toyota Camry", type: "Седан", supplier: "Hertz", pricePerDay: "₽4500", rating: 4.8, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/camry/800/600" },
        { name: "Renault Duster", type: "SUV", supplier: "Avis", pricePerDay: "₽3800", rating: 4.7, features: { passengers: 5, luggage: 4, transmission: "Механика", doors: 4 }, imageUrl: "https://picsum.photos/seed/duster/800/600" },
        { name: "BMW 5 Series", type: "Премиум", supplier: "Sixt", pricePerDay: "₽9500", rating: 4.9, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/bmw5/800/600" },
        { name: "Hyundai Creta", type: "SUV", supplier: "Local Rent", pricePerDay: "₽3500", rating: 4.6, features: { passengers: 5, luggage: 3, transmission: "Автомат", doors: 4 }, imageUrl: "https://picsum.photos/seed/creta/800/600" },
    ],
};

const mockCarDataWithSlugs = mockCarData.recommendations.map((car, index) => ({
    ...car,
    slug: generateSlug(car.name, index)
}));

export default function RentalCarPageContent() {
  const [recommendations, setRecommendations] = useState<CarRecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('rentalCarRecommendations', JSON.stringify(mockCarDataWithSlugs));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);

    // TODO: Connect to AI flow
    console.log(values);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const recommendationsWithSlugs = mockCarData.recommendations.map((rec, index) => ({
        ...rec,
        slug: generateSlug(rec.name, index)
    }));

    if (typeof window !== 'undefined') {
        sessionStorage.setItem('rentalCarRecommendations', JSON.stringify(recommendationsWithSlugs));
    }
    setRecommendations(recommendationsWithSlugs);
    
    // toast({
    //   title: "Поиск в разработке",
    //   description: "Функционал поиска автомобилей скоро будет добавлен.",
    // });
    setIsLoading(false);
  }

  const currentCars = hasSearched ? recommendations : mockCarDataWithSlugs;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-7xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Аренда автомобилей</CardTitle>
          <CardDescription>Найдите лучший автомобиль для вашего путешествия.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Место получения</FormLabel>
                      <FormControl>
                        <Input placeholder="Город или аэропорт" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Даты аренды</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full justify-start text-left font-normal", !field.value?.from && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value?.from ? (field.value.to ? (<>{format(field.value.from, "d LLL", { locale: ru })} - {format(field.value.to, "d LLL, y", { locale: ru })}</>) : (format(field.value.from, "d LLL, y", { locale: ru }))) : (<span>Выберите даты</span>)}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar initialFocus mode="range" defaultMonth={field.value?.from} selected={{ from: field.value?.from, to: field.value?.to }} onSelect={(range) => field.onChange(range)} numberOfMonths={2} locale={ru} />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти автомобиль
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти автомобиль для вашей поездки. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <RentalCarFilters />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} автомобилей</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {recommendations.map((car, index) => (
                  <CarCard key={index} car={car} index={index} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && hasSearched && (!recommendations || recommendations.length === 0) && (
             <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg h-full">
                 <h3 className="text-xl font-semibold">Ничего не найдено</h3>
                 <p className="text-muted-foreground mt-1 max-w-sm">Попробуйте изменить параметры поиска.</p>
             </div>
          )}
           
          {!isLoading && !hasSearched && (
              <div>
                  <h2 className="text-2xl font-headline font-bold mb-6">Популярные предложения</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                      {currentCars.map((car, index) => (
                          <CarCard key={index} car={car} index={index} />
                      ))}
                  </div>
              </div>
          )}
        </main>
      </div>

    </div>
  );
}
