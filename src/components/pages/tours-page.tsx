'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";

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
import { CalendarIcon, Loader2, Search, Star } from "lucide-react";
import { format } from "date-fns";
import { ru } from 'date-fns/locale';
import { aiTourRecommendations, type AiTourRecommendationsOutput } from '@/ai/flows/ai-tour-recommendations';
import Link from "next/link";
import { TourFilters } from "@/components/tour-filters";
import { Skeleton } from "../ui/skeleton";

type TourRecommendationWithSlug = AiTourRecommendationsOutput[0] & { slug: string };

const formSchema = z.object({
  destination: z.string().min(2, { message: "Пункт назначения должен содержать не менее 2 символов." }),
  dates: z.object({
    from: z.date({ required_error: "Необходима дата начала." }),
    to: z.date({ required_error: "Необходима дата окончания." }),
  }),
  interests: z.string().min(3, { message: "Опишите ваши интересы."}),
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


const mockTourData: AiTourRecommendationsOutput = [
    {
        name: "Обзорная экскурсия по Риму",
        description: "Откройте для себя величие Колизея, Римского форума и Пантеона в этой увлекательной пешеходной экскурсии.",
        type: "культурный",
        priceRange: "€50",
        bookingLink: "#",
        relevanceScore: 95,
        duration: "4 часа",
        groupSize: "до 15 чел.",
        highlights: ["Колизей", "Римский форум", "Пантеон"],
        included: ["Гид", "Наушники"],
        excluded: ["Входные билеты", "Еда и напитки"],
        galleryImageUrls: [
            "https://picsum.photos/seed/rome-tour-1/800/600",
            "https://picsum.photos/seed/rome-tour-2/800/600",
            "https://picsum.photos/seed/rome-tour-3/800/600",
            "https://picsum.photos/seed/rome-tour-4/800/600"
        ]
    },
    {
        name: "Гастрономический тур по Токио",
        description: "Попробуйте настоящие суши, рамен и другие японские деликатесы на оживленных улицах Токио.",
        type: "еда",
        priceRange: "¥12000",
        bookingLink: "#",
        relevanceScore: 92,
        duration: "3 часа",
        groupSize: "до 8 чел.",
        highlights: ["Рынок Цукидзи", "Дегустация саке", "Мастер-класс по суши"],
        included: ["Гид", "Дегустации"],
        excluded: ["Обед", "Транспорт"],
        galleryImageUrls: [
            "https://picsum.photos/seed/tokyo-tour-1/800/600",
            "https://picsum.photos/seed/tokyo-tour-2/800/600",
            "https://picsum.photos/seed/tokyo-tour-3/800/600",
            "https://picsum.photos/seed/tokyo-tour-4/800/600"
        ]
    },
    {
        name: "Полет на вертолете над Гранд-Каньоном",
        description: "Насладитесь захватывающими видами Гранд-Каньона с высоты птичьего полета.",
        type: "приключение",
        priceRange: "$250",
        bookingLink: "#",
        relevanceScore: 98,
        duration: "1 час",
        groupSize: "до 6 чел.",
        highlights: ["Вид на плотину Гувера", "Полет над каньоном", "Фото-остановки"],
        included: ["Полет", "Трансфер из отеля"],
        excluded: ["Сборы национального парка"],
        galleryImageUrls: [
            "https://picsum.photos/seed/canyon-tour-1/800/600",
            "https://picsum.photos/seed/canyon-tour-2/800/600",
            "https://picsum.photos/seed/canyon-tour-3/800/600",
            "https://picsum.photos/seed/canyon-tour-4/800/600"
        ]
    },
    {
        name: "Винный тур по Тоскане",
        description: "Посетите знаменитые винодельни региона Кьянти и насладитесь дегустацией лучших итальянских вин.",
        type: "еда",
        priceRange: "€90",
        bookingLink: "#",
        relevanceScore: 94,
        duration: "Полный день",
        groupSize: "до 25 чел.",
        highlights: ["Дегустация вина Кьянти", "Посещение 2 виноделен", "Обед на ферме"],
        included: ["Транспорт", "Дегустации", "Обед"],
        excluded: ["Личные расходы"],
        galleryImageUrls: [
            "https://picsum.photos/seed/tuscany-tour-1/800/600",
            "https://picsum.photos/seed/tuscany-tour-2/800/600",
            "https://picsum.photos/seed/tuscany-tour-3/800/600",
            "https://picsum.photos/seed/tuscany-tour-4/800/600"
        ]
    },
     {
        name: "Дайвинг на Большом Барьерном рифе",
        description: "Исследуйте подводный мир одного из семи чудес природы.",
        type: "приключение",
        priceRange: "$200",
        bookingLink: "#",
        relevanceScore: 96,
        duration: "Полный день",
        groupSize: "до 20 чел.",
        highlights: ["2 погружения с аквалангом", "Снорклинг", "Обед на катамаране"],
        included: ["Оборудование", "Инструктаж", "Обед"],
        excluded: ["Подводные фотографии"],
        galleryImageUrls: [
            "https://picsum.photos/seed/diving-tour-1/800/600",
            "https://picsum.photos/seed/diving-tour-2/800/600",
            "https://picsum.photos/seed/diving-tour-3/800/600",
            "https://picsum.photos/seed/diving-tour-4/800/600"
        ]
    },
    {
        name: "Посещение Лувра с гидом",
        description: "Узнайте истории величайших произведений искусства, включая Мону Лизу и Венеру Милосскую.",
        type: "культурный",
        priceRange: "€75",
        bookingLink: "#",
        relevanceScore: 93,
        duration: "3 часа",
        groupSize: "до 20 чел.",
        highlights: ["Мона Лиза", "Венера Милосская", "Ника Самофракийская"],
        included: ["Гид", "Приоритетный вход"],
        excluded: ["Доступ на временные выставки"],
        galleryImageUrls: [
            "https://picsum.photos/seed/louvre-tour-1/800/600",
            "https://picsum.photos/seed/louvre-tour-2/800/600",
            "https://picsum.photos/seed/louvre-tour-3/800/600",
            "https://picsum.photos/seed/louvre-tour-4/800/600"
        ]
    }
];
const mockToursWithSlugs: TourRecommendationWithSlug[] = mockTourData.map((tour, index) => ({
    ...tour,
    slug: generateSlug(tour.name, index),
}));

function TourCard({ tour }: { tour: TourRecommendationWithSlug }) {
  return (
    <Card className="flex flex-col group transition-shadow hover:shadow-xl">
        <CardHeader>
            <div className="flex justify-between items-start gap-4">
                <CardTitle className="font-headline text-xl group-hover:text-primary transition-colors">{tour.name}</CardTitle>
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{ (tour.relevanceScore / 20).toFixed(1) }</span>
                </div>
            </div>
            <CardDescription className="capitalize">{tour.type}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
            <p className="text-sm text-muted-foreground line-clamp-3">{tour.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center bg-secondary/30 mt-auto pt-4">
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Цена от</span>
                <span className="font-bold text-lg">{tour.priceRange}</span>
            </div>
            <Button asChild>
                <Link href={`/tours/${tour.slug}`}>Подробнее</Link>
            </Button>
        </CardFooter>
    </Card>
  )
}


function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="flex flex-col">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                    <CardFooter className="flex justify-between items-center bg-secondary/30 mt-auto pt-4">
                        <Skeleton className="h-8 w-1/3" />
                        <Skeleton className="h-10 w-1/4" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}


export default function ToursPageContent() {
  const [recommendations, setRecommendations] = useState<TourRecommendationWithSlug[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      interests: "история, еда, архитектура",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setHasSearched(true);
    setRecommendations([]);
    try {
      const result = await aiTourRecommendations({
        destination: values.destination,
        travelDates: {
          start: values.dates.from.toISOString(),
          end: values.dates.to.toISOString(),
        },
        interests: values.interests.split(',').map(i => i.trim()),
      });
      const recommendationsWithSlugs = result.map((rec, index) => ({
          ...rec,
          slug: generateSlug(rec.name, index)
      }));

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tourRecommendations', JSON.stringify(recommendationsWithSlugs));
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

  const currentTours = hasSearched ? recommendations : mockToursWithSlugs;
  if(typeof window !== 'undefined' && !hasSearched) {
      sessionStorage.setItem('tourRecommendations', JSON.stringify(mockToursWithSlugs));
  }


  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="max-w-7xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Поиск туров и экскурсий</CardTitle>
          <CardDescription>Найдите идеальные развлечения для вашего путешествия с помощью AI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Куда вы едете?</FormLabel>
                      <FormControl>
                        <Input placeholder="Например, Рим, Италия" {...field} />
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
                      <FormLabel>Когда?</FormLabel>
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
                 <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                    <FormItem className="flex flex-col justify-end">
                        <FormLabel>Ваши интересы</FormLabel>
                        <FormControl>
                        <Input placeholder="история, еда..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
               <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                    Найти туры
                </Button>
               </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {!isLoading && !hasSearched && (
           <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg max-w-4xl mx-auto">
              <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold">Результаты поиска появятся здесь</h3>
              <p className="text-muted-foreground mt-1 max-w-sm">Заполните форму выше, чтобы найти туры, которые подходят именно вам. Ниже представлены популярные варианты.</p>
          </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <TourFilters />
        </aside>

        <main className="lg:col-span-3">
            {isLoading && <LoadingSkeleton />}
            
            {!isLoading && !hasSearched && (
                 <div>
                    <h2 className="text-2xl font-headline font-bold mb-6">Популярные туры</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {mockToursWithSlugs.map((tour, index) => (
                            <TourCard key={index} tour={tour} />
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && hasSearched && recommendations && recommendations.length > 0 && (
                <div>
                <h2 className="text-2xl font-headline font-bold mb-6">Найдено {recommendations.length} туров</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {recommendations.map((tour, index) => (
                    <TourCard key={index} tour={tour} />
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
        </main>
      </div>

    </div>
  );
}
