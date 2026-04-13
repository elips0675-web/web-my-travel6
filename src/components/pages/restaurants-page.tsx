'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Search, Star, MapPin } from "lucide-react";
import { aiRestaurantRecommendations, type AiRestaurantRecommendationsOutput } from '@/ai/flows/ai-restaurant-recommendations';
import { Textarea } from "@/components/ui/textarea";
import { RestaurantFilters } from "@/components/restaurant-filters";
import { Skeleton } from "@/components/ui/skeleton";

type RecommendationWithSlug = AiRestaurantRecommendationsOutput['recommendations'][0] & { slug: string };

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  preferences: z.string().min(3, { message: "Опишите ваши предпочтения."}),
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


function RestaurantCard({ recommendation, index }: { recommendation: RecommendationWithSlug, index: number }) {
  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-xl flex flex-col">
      <div className="relative aspect-video">
        <Image
          src={recommendation.imageUrl || `https://picsum.photos/seed/restaurant${index}/800/600`}
          alt={recommendation.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint={`${recommendation.cuisine.toLowerCase()} food`}
        />
      </div>
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-start mb-2">
            <div>
                <CardDescription>{recommendation.cuisine} • {recommendation.priceRange}</CardDescription>
                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{recommendation.name}</CardTitle>
            </div>
            {recommendation.rating && (
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{recommendation.rating.toFixed(1)}</span>
                </div>
            )}
        </div>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recommendation.description}</p>
        <div className="text-sm text-muted-foreground flex items-center">
            <MapPin className="w-4 h-4 mr-1.5" />
            {recommendation.location}
        </div>
      </div>
       <CardFooter className="bg-secondary/30 p-4 flex justify-end mt-auto">
            <Button asChild>
                <Link href={`/restaurants/${recommendation.slug}`}>Забронировать</Link>
            </Button>
      </CardFooter>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="overflow-hidden flex flex-col">
            <Skeleton className="h-48 w-full" />
            <div className="p-4 space-y-3 flex-grow">
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-1/4" />
                </div>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </div>
             <CardFooter className="bg-secondary/30 p-4 flex justify-end mt-auto">
                <Skeleton className="h-10 w-28" />
             </CardFooter>
        </Card>
      ))}
    </div>
  )
}

const mockRestaurantData: AiRestaurantRecommendationsOutput = {
    recommendations: [
      { name: "White Rabbit", cuisine: "Современная русская", location: "Смоленская пл., 3, Москва", description: "Панорамный ресторан с видом на Москву, известный своей инновационной русской кухней.", priceRange: "₽₽₽₽", rating: 4.8, specialty: "Борщ с жареными карасями", imageUrl: "https://picsum.photos/seed/whiterabbit/800/600" },
      { name: "Probka на Цветном", cuisine: "Итальянская", location: "Цветной б-р, 2, Москва", description: "Уютный итальянский ресторан от Арама Мнацаканова с аутентичной кухней и отличной винной картой.", priceRange: "₽₽₽", rating: 4.7, specialty: "Пицца с трюфелем", imageUrl: "https://picsum.photos/seed/probka/800/600" },
      { name: "Кафе Пушкинъ", cuisine: "Русская дворянская", location: "Тверской б-р, 26А, Москва", description: "Легендарный ресторан-аптека с атмосферой XIX века и классической русской кухней.", priceRange: "₽₽₽₽", rating: 4.6, specialty: "Пожарская котлета", imageUrl: "https://picsum.photos/seed/pushkin/800/600" },
      { name: "Горыныч", cuisine: "Гриль", location: "Рождественский б-р, 1, Москва", description: "Ресторан с огромными печами, где готовят блюда на огне. Отличные завтраки и хлеб из собственной пекарни.", priceRange: "₽₽₽", rating: 4.7, specialty: "Стейки и неаполитанская пицца", imageUrl: "https://picsum.photos/seed/gorynych/800/600" },
      { name: "Sehnsucht", cuisine: "Европейская", location: "Казанская ул., 3А, Санкт-Петербург", description: "Стильный ресторан с авторской кухней и коктейлями в самом центре Петербурга.", priceRange: "₽₽₽", rating: 4.8, specialty: "Тартар из говядины", imageUrl: "https://picsum.photos/seed/sehnsucht/800/600" },
      { name: "Harvest", cuisine: "Овощная", location: "пр. Добролюбова, 11, Санкт-Петербург", description: "Инновационный ресторан, где овощи играют главную роль. Входит в The World's 50 Best Restaurants.", priceRange: "₽₽₽₽", rating: 4.9, specialty: "Капуста с черной икрой", imageUrl: "https://picsum.photos/seed/harvest/800/600" },
    ],
};

const mockRestaurantDataWithSlugs = mockRestaurantData.recommendations.map((rec, index) => ({
    ...rec,
    slug: generateSlug(rec.name, index)
}));

export default function RestaurantsPageContent() {
  const [recommendations, setRecommendations] = useState<RecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
        sessionStorage.setItem('restaurantRecommendations', JSON.stringify(mockRestaurantDataWithSlugs));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      preferences: "уютная атмосфера, вкусная еда, не слишком дорого",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);

    try {
        const result = await aiRestaurantRecommendations({
            destination: values.destination,
            preferences: values.preferences,
        });

        const recommendationsWithSlugs = result.recommendations.map((rec, index) => ({
            ...rec,
            slug: generateSlug(rec.name, index)
        }));

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('restaurantRecommendations', JSON.stringify(recommendationsWithSlugs));
        }
        setRecommendations(recommendationsWithSlugs);
    } catch (error) {
        console.error(error);
        toast({
            title: "Ошибка",
            description: "Не удалось получить рекомендации. Попробуйте еще раз.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  const currentRestaurants = hasSearched ? recommendations : mockRestaurantDataWithSlugs;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Поиск кафе и ресторанов</CardTitle>
          <CardDescription>Найдите идеальное место для ужина, обеда или завтрака с помощью AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Где вы ищете?</FormLabel>
                    <FormControl>
                      <Input placeholder="Например, Москва" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ваши предпочтения</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Например: итальянская кухня, вид на город, для свидания" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Найти рестораны
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto mb-8">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1">Заполните форму выше, чтобы найти лучшие места. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <RestaurantFilters />
        </aside>

        <main className="lg:col-span-3">
          {isLoading && <LoadingSkeleton />}
          
          {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
            <div>
              <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} вариантов</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec, index) => (
                  <RestaurantCard key={rec.slug} recommendation={rec} index={index} />
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
                  <h2 className="text-2xl font-headline font-bold mb-6">Популярные рестораны</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentRestaurants.map((rec, index) => (
                          <RestaurantCard key={rec.slug} recommendation={rec} index={index} />
                      ))}
                  </div>
              </div>
          )}
        </main>
      </div>
    </div>
  );
}
